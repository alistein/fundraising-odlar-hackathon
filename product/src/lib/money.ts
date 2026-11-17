// All amounts are stored as integer qəpik (1 AZN = 100 qəpik).
export function formatAZN(qepik: number): string {
  return `${(qepik / 100).toLocaleString("az-AZ", { maximumFractionDigits: 2 })} ₼`;
}

export function aznToQepik(azn: number): number {
  return Math.round(azn * 100);
}
