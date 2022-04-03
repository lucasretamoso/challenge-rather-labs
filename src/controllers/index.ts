import { marketTipsService } from '../services';
import { MarketTipsController } from './listeners/marketTipsController';

const marketTipsController = new MarketTipsController(marketTipsService);

export {
  marketTipsController
};