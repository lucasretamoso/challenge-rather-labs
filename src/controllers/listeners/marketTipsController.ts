import { WebSocket } from 'ws';
import { BitfinexBookRequestDTO } from '../../../data/DTOs/bitfinexMessageDTO';
import { BadArgumentsException } from '../../../data/errors/badArgumentsException';
import { IMarketTipsService } from '../../services/marketTipsService';

export interface IMarketTipsController {
  getMarketTips(data: BitfinexBookRequestDTO, ws: WebSocket): void;
  pauseMarketTips(): void;
}

export class MarketTipsController implements IMarketTipsController {
  
  constructor(private readonly marketTipsService: IMarketTipsService) {}
  
  getMarketTips(data: BitfinexBookRequestDTO, wsOrigin: WebSocket): void {
    if (!data.symbol) {
      throw new BadArgumentsException('Symbol field is required');
    }

    const msg = {
      event: 'subscribe',
      channel: 'book',
      ...data
    };
    
    this.marketTipsService.getOrderbookByPairName(msg, wsOrigin);
  }

  pauseMarketTips(): void {
    this.marketTipsService.removeAllHandshaking();
  }
}
