/**
 * Forces each bar's open to the previous close so candles meet visually.
 * Mutates the array in place.
 */
export function connectBarContinuity(bars) {
  if (!bars || bars.length < 2) return bars;
  for (let i = 1; i < bars.length; i++) {
    const prevClose = bars[i - 1].close;
    const bar = bars[i];
    bar.open = prevClose;
    bar.high = Math.max(bar.high, prevClose);
    bar.low = Math.min(bar.low, prevClose);
  }
  return bars;
}
