import ws, { WebSocket } from 'ws';
import {
  BitfinexMessageDTO,
} from '../data/DTOs/bitfinexMessageDTO';
import { BadArgumentsException } from '../data/errors/badArgumentsException';
import { UnexpectedException } from '../data/errors/unexpectedException';

export interface IBitfinexService {
  getTickerByPairName(
    data: BitfinexMessageDTO,
    wsOrigin: WebSocket
  ): void;
  removeAllHandshaking(): void;
}

export class BitfinexService implements IBitfinexService {
  private socket: ws;

  constructor() {
    this.socket = new ws(process.env.BITFINEX_URL || '');
  }

  getTickerByPairName(
    msg: BitfinexMessageDTO,
    wsOrigin: WebSocket
  ): void {
    try {
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
    } catch (err) {
      if (err instanceof Error) {
        wsOrigin.emit('error', new UnexpectedException(err.message));
      } else {
        wsOrigin.emit('error', new UnexpectedException(JSON.stringify(err)));
      }
    }
  }

  removeAllHandshaking() {
    this.socket.removeAllListeners();
  }

  private parseMessageOrderBook(msg: ws.RawData): string | undefined {
    const parseResult = JSON.parse(msg.toString());
    if(Array.isArray(parseResult) && Array.isArray(parseResult[1])) {
      return JSON.stringify({
        bid: {
          price: parseResult[1][0],
          size: parseResult[1][1]
        },
        ask: {
          price: parseResult[1][2],
          size: parseResult[1][3]
        }
      });
    }
  }
}
