/**
 * Catalog seed: hydrates Era / CardSet / Artist / Card from pokemontcg.io.
 *
 * Idempotent — safe to re-run when new sets drop.
 *
 * Usage:
 *   npx tsx scripts/seed-catalog.ts                 # all English sets
 *   npx tsx scripts/seed-catalog.ts --sets swsh3    # specific sets only
 *   POKEMONTCG_API_KEY=xxx npx tsx scripts/seed-catalog.ts   # higher rate limits
 */

import { PrismaClient, FoilType } from "../generated/prisma";

const db = new PrismaClient();

const API_BASE = "https://api.pokemontcg.io/v2";
const PAGE_SIZE = 250;

const headers: Record<string, string> = {};
if (process.env.POKEMONTCG_API_KEY) {
  headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
}

interface PtcgSet {
  id: string;
  name: string;
  series: string;
  releaseDate?: string;
}

interface PtcgCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  artist?: string;
  types?: string[];
  subtypes?: string[];
  set: { id: string; name: string; series: string };
  images?: { large?: string; small?: string };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Heuristic mapping from pokemontcg.io rarity → our FoilType enum. Seeded as a baseline; admin overrides on listing. */
function inferFoilType(rarity: string | undefined, subtypes: string[]): FoilType {
  const r = (rarity ?? "").toLowerCase();
  const subs = subtypes.map((s) => s.toLowerCase());

  if (r.includes("rainbow")) return FoilType.RAINBOW_RARE;
  if (r.includes("gold") || r.includes("secret")) return FoilType.GOLD_SECRET_RARE;
  if (r.includes("special illustration")) return FoilType.SPECIAL_ILLUSTRATION_RARE;
  if (r.includes("alternate art")) return FoilType.ALTERNATE_ART;
  if (r.includes("textured") && r.includes("full art")) return FoilType.TEXTURED_FULL_ART;
  if (r.includes("full art")) return FoilType.FULL_ART;
  if (r.includes("vmax")) return FoilType.VMAX_TEXTURED;
  if (r.includes("vstar")) return FoilType.VSTAR_HOLO;
  if (r.includes("v ") || r.endsWith(" v") || subs.includes("v")) return FoilType.V_HOLO;
  if (r.includes("ex") && r.includes("holo")) return FoilType.EX_HOLO;
  if (r.includes("gx") && r.includes("full art")) return FoilType.GX_FULL_ART;
  if (r.includes("radiant")) return FoilType.RADIANT;
  if (r.includes("shiny")) return FoilType.SHINY_HOLO;
  if (r.includes("reverse holo")) return FoilType.REVERSE_HOLO;
  if (r.includes("holo")) return FoilType.HOLO;
  return FoilType.NON_HOLO;
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`pokemontcg.io ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

async function fetchAllSets(): Promise<PtcgSet[]> {
  const all: PtcgSet[] = [];
  let page = 1;
  while (true) {
    const res = await fetchJson<{ data: PtcgSet[]; totalCount: number }>(
      `/sets?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.data);
    if (all.length >= res.totalCount || res.data.length === 0) break;
    page++;
  }
  return all;
}

async function fetchAllCardsForSet(setId: string): Promise<PtcgCard[]> {
  const all: PtcgCard[] = [];
  let page = 1;
  while (true) {
    const res = await fetchJson<{ data: PtcgCard[]; totalCount: number }>(
      `/cards?q=set.id:${setId}&page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.data);
    if (all.length >= res.totalCount || res.data.length === 0) break;
    page++;
  }
  return all;
}

async function ensureArtist(name: string, cache: Map<string, string>): Promise<string> {
  const cached = cache.get(name);
  if (cached) return cached;
  const existing = await db.artist.findFirst({ where: { name } });
  if (existing) {
    cache.set(name, existing.id);
    return existing.id;
  }
  const created = await db.artist.create({ data: { name } });
  cache.set(name, created.id);
  return created.id;
}

async function main() {
  const args = process.argv.slice(2);
  const setsArgIdx = args.indexOf("--sets");
  const setsFilter =
    setsArgIdx >= 0 ? new Set(args[setsArgIdx + 1]?.split(",") ?? []) : null;

  console.log("Fetching sets from pokemontcg.io…");
  const sets = await fetchAllSets();
  console.log(`  ${sets.length} sets`);

  // Eras: derive from `series`, slugified
  const eraIds = new Map<string, string>(); // series → eraId
  for (const set of sets) {
    if (!eraIds.has(set.series)) {
      eraIds.set(set.series, slugify(set.series));
    }
  }

  console.log(`Upserting ${eraIds.size} eras…`);
  for (const [name, id] of eraIds) {
    await db.era.upsert({
      where: { id },
      create: { id, name },
      update: { name },
    });
  }

  const setsToProcess = setsFilter ? sets.filter((s) => setsFilter.has(s.id)) : sets;
  console.log(`Processing ${setsToProcess.length} sets…`);

  // Upsert all CardSets first
  for (const set of setsToProcess) {
    const eraId = eraIds.get(set.series);
    if (!eraId) continue;
    await db.cardSet.upsert({
      where: { id: set.id },
      create: { id: set.id, name: set.name, eraId },
      update: { name: set.name, eraId },
    });
  }

  const artistCache = new Map<string, string>();

  let cardCount = 0;
  for (const set of setsToProcess) {
    process.stdout.write(`  ${set.id} (${set.name})… `);
    const cards = await fetchAllCardsForSet(set.id);
    for (const card of cards) {
      const artistName = card.artist?.trim() || "Unknown";
      const artistId = await ensureArtist(artistName, artistCache);
      const foilType = inferFoilType(card.rarity, card.subtypes ?? []);
      await db.card.upsert({
        where: { id: card.id },
        create: {
          id: card.id,
          name: card.name,
          setId: card.set.id,
          number: card.number,
          rarity: card.rarity ?? null,
          artistId,
          foilType,
          imageUrl: card.images?.large ?? card.images?.small ?? null,
          types: card.types ?? [],
        },
        update: {
          name: card.name,
          number: card.number,
          rarity: card.rarity ?? null,
          artistId,
          foilType,
          imageUrl: card.images?.large ?? card.images?.small ?? null,
          types: card.types ?? [],
        },
      });
      cardCount++;
    }
    console.log(`${cards.length} cards`);
  }

  console.log(`\nDone. ${cardCount} cards across ${setsToProcess.length} sets.`);
  await db.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await db.$disconnect();
  process.exit(1);
});
