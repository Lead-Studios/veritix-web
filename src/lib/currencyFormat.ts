export function formatCurrency(n: number): string {
  return `₦ ${n.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
