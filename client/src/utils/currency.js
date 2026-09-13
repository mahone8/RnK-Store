// Formats a numeric amount as PKR, e.g. formatPKR(2499) -> "Rs 2,499"
export function formatPKR(amount) {
  const n = Math.round(Number(amount) || 0);
  return `Rs ${n.toLocaleString('en-PK')}`;
}
