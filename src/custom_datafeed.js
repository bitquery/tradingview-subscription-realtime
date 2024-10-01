

import { resolveSymbol } from './resolveSymbol';
import { getBars, subscribeBars, unsubscribeBars } from './getBars';
import { onReady } from './onReady';

const Datafeed = {
  onReady,
  resolveSymbol,
  getBars,
  subscribeBars, 
  unsubscribeBars,
};

export default Datafeed;
