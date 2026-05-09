import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mt-12 text-5xl font-bold">PokeHub</h1>
      <p className="mt-4 text-lg text-gray-600">
        Sealed Pokémon TCG product, raw singles, and graded slabs.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white"
      >
        Browse the shop →
      </Link>
    </main>
  );
}
