import { WebSocket } from 'ws';
import { EffectivePriceDTO } from '../../data/DTOs/bitfinexOrderBookDTO';
import { OrdenBookEventEnum } from '../../data/enums/orderBookEventEnum';
import { BadArgumentsException } from '../../data/errors/badArgumentsException';
import { IBitfinexOrderBookService } from '../../services/bitfinexOrderBookService';

export interface IMarketOrderBookController {
  getEffectivePrice(data: Partial<EffectivePriceDTO>, ws: WebSocket): void;
  pauseMarketEffectivePrice(): void;
}

export class MarketOrderBookController implements IMarketOrderBookController {
  
  constructor(private readonly bitfinexOrderBookService: IBitfinexOrderBookService) {}
  
  getEffectivePrice(data: Partial<EffectivePriceDTO>, wsOrigin: WebSocket): void {
    try {
      if (!data.symbol) {
        throw new BadArgumentsException('Symbol field is required');
      }

      if (!data.count) {
        throw new BadArgumentsException('Count field is required');
      }

      if (!data.operation) {
        throw new BadArgumentsException('Operation field is required');
      }
  
      const msg: EffectivePriceDTO = {
        event: 'subscribe',
        channel: 'book',
        symbol: data.symbol,
        count: data.count,
        operation: data.operation,
        frec: 'F1',
      };
      
      this.bitfinexOrderBookService.getOrderbookByPairName(msg, wsOrigin);
    } catch (err) {
      wsOrigin.emit('error', err);
      wsOrigin.emit(OrdenBookEventEnum.OrderBookEffectivePricePause);
    }
  }

  pauseMarketEffectivePrice(): void {
    this.bitfinexOrderBookService.removeAllHandshaking();
  }
}
