import { WebSocket } from 'ws';
import { BitfinexMessageDTO } from '../../../data/DTOs/bitfinexMessageDTO';
import { BadArgumentsException } from '../../../data/errors/badArgumentsException';
import { IBitfinexService } from '../../services/bitfinexService';

export interface IMarketTipsController {
  getMarketTicker(data: Partial<BitfinexMessageDTO>, ws: WebSocket): void;
  pauseMarketTicker(): void;
}

export class MarketTipsController implements IMarketTipsController {
  
  constructor(private readonly marketTickerService: IBitfinexService) {}
  
  getMarketTicker(data: Partial<BitfinexMessageDTO>, wsOrigin: WebSocket): void {
    try {
      if (!data.symbol) {
        throw new BadArgumentsException('Symbol field is required');
      }
  
      const msg: BitfinexMessageDTO = {
        event: 'subscribe',
        channel: 'ticker',
        symbol: data.symbol
      };
      
      this.marketTickerService.getOrderbookByPairName(msg, wsOrigin);
    } catch (err) {
      wsOrigin.emit('error', err);
      wsOrigin.emit('market:tip:ob:pause');
    }
  }

  pauseMarketTicker(): void {
    this.marketTickerService.removeAllHandshaking();
  }
}
