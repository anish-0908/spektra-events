export function tierPrices(event) {
  const base = event.price
  return {
    premium: Math.round(base * 1.85),
    gold: Math.round(base * 1.35),
    silver: base,
  }
}
