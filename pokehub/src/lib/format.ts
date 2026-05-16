export function formatCents(cents: number): string {
  return `A$${(cents / 100).toFixed(2)}`;
}
