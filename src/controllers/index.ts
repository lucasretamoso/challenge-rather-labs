import { bitfinexService, bitfinexOrderBookService } from '../services';
import { MarketOrderBookController } from './listeners/marketOrderBookController';
import { MarketTipsController } from './listeners/marketTipsController';

const marketTipsController = new MarketTipsController(bitfinexService);
const marketOrderBookController = new MarketOrderBookController(bitfinexOrderBookService);

export {
  marketTipsController,
  marketOrderBookController
};