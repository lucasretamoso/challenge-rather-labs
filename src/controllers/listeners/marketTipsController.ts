import { WebSocket } from 'ws';
import { BitfinexBookMessegetDTO, BitfinexBookRequestDTO } from '../../../data/DTOs/bitfinexMessageDTO';
import { BitfinexFrequencyEnum, BitfinexPrecisionEnum } from '../../../data/enums/bitfinexEnum';
import { BadArgumentsException } from '../../../data/errors/badArgumentsException';
import { IMarketTipsService } from '../../services/marketTipsService';

export interface IMarketTipsController {
  getMarketTips(data: BitfinexBookRequestDTO, ws: WebSocket): void;
  pauseMarketTips(): void;
}

export class MarketTipsController implements IMarketTipsController {
  
  constructor(private readonly marketTipsService: IMarketTipsService) {}
  
  getMarketTips(data: BitfinexBookRequestDTO, wsOrigin: WebSocket): void {
    try {
      if (!data.symbol) {
        throw new BadArgumentsException('Symbol field is required');
      }
  
      if (data.freq && !BitfinexFrequencyEnum[data.freq]) {
        throw new BadArgumentsException('The frequency field does not exist');
      }
  
      if (data.prec && !BitfinexPrecisionEnum[data.prec]) {
        throw new BadArgumentsException('The precision field does not exist');
      }
  
      const msg: BitfinexBookMessegetDTO = {
        event: 'subscribe',
        channel: 'book',
        ...data
      };
      
      this.marketTipsService.getOrderbookByPairName(msg, wsOrigin);
    } catch (err) {
      wsOrigin.emit('error', err);
      wsOrigin.emit('market:tip:ob:pause')
    }
  }

  pauseMarketTips(): void {
    this.marketTipsService.removeAllHandshaking();
  }
}
