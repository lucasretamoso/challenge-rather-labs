import ws, { WebSocket } from 'ws';
import {
  BitfinexBookMessegetDTO,
  BitfinexBookRequestDTO,
} from '../../data/DTOs/bitfinexMessageDTO';
import { BadArgumentsException } from '../../data/errors/badArgumentsException';

export interface IMarketTipsService {
  getOrderbookByPairName(
    data: BitfinexBookRequestDTO,
    wsOrigin: WebSocket
  ): void;
  removeAllHandshaking(): void;
}

export class MarketTipsService implements IMarketTipsService {
  private socket: ws;

  constructor() {
    this.socket = new ws('wss://api-pub.bitfinex.com/ws/2');
  }

  getOrderbookByPairName(
    msg: BitfinexBookMessegetDTO,
    wsOrigin: WebSocket
  ): void {
    this.removeAllHandshaking();
    
    this.socket.on('message', (msg) => {
      const parseMessage = this.parseMessageOrderBook(msg);
      if (parseMessage) {
        wsOrigin.send(parseMessage);
      }
    });

    this.socket.send(JSON.stringify(msg));

    this.socket.on('error', (err) =>
      wsOrigin.emit('error', new BadArgumentsException(err.message))
    );
  }

  removeAllHandshaking() {
    this.socket.removeAllListeners();
  }

  private parseMessageOrderBook(msg: ws.RawData): string | undefined {
    const parseResult = JSON.parse(msg.toString());
    if (Array.isArray(parseResult) && Array.isArray(parseResult[1])) {
      const result = JSON.stringify(
        parseResult[1]
          .map((result, index) => {
            if (Array.isArray(result)) {
              return {
                amount: result[2] || result,
                price: result[0] || result,
              };
            } else if (index === 1) {
              return {
                amount: parseResult[1][2],
                price: parseResult[1][0],
              };
            }
          })
          .filter(Boolean)
      );
      return result;
    }
    return undefined;
  }
}
