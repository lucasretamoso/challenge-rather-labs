import { bitfinexService } from '../services';
import { MarketTipsController } from './listeners/marketTipsController';

const marketTipsController = new MarketTipsController(bitfinexService);

export {
  marketTipsController
};