import { BitfinexOrderBookService } from './bitfinexOrderBookService';
import { BitfinexService } from './bitfinexService';

const bitfinexService = new BitfinexService();

const bitfinexOrderBookService = new BitfinexOrderBookService();

export {
  bitfinexService,
  bitfinexOrderBookService
};