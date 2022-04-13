import ws, { WebSocket } from 'ws';
import {
  BitfinexOrderBookDTO,
  EffectivePriceDTO,
} from '../data/DTOs/bitfinexOrderBookDTO';
import { BadArgumentsException } from '../data/errors/badArgumentsException';
import { UnexpectedException } from '../data/errors/unexpectedException';

export interface IBitfinexOrderBookService {
  getOrderbookByPairName(data: EffectivePriceDTO, wsOrigin: WebSocket): void;
  removeAllHandshaking(): void;
}

export class BitfinexOrderBookService implements IBitfinexOrderBookService {
  private socket: ws;
  private orderBook: BitfinexOrderBookDTO;

  constructor() {
    this.socket = new ws(process.env.BITFINEX_URL || '');
    this.orderBook = {
      bid: new Map(),
      ask: new Map(),
    };
  }

  getOrderbookByPairName(msg: EffectivePriceDTO, wsOrigin: WebSocket): void {
    try {
      this.removeAllHandshaking();
  
      this.socket.on('message', (msgEvent) => {
        this.parseMessageOrderBook(msgEvent);
        if (this.orderBook.ask.size > 0 && this.orderBook.bid.size > 0) {
          wsOrigin.send(
            JSON.stringify({
              effectivePrice: this.calculateEffectivePrice(
                msg.operation,
                msg.count
              ),
            })
          );
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

  removeAllHandshaking() {
    this.orderBook.ask.clear();
    this.orderBook.bid.clear();
    this.socket.removeAllListeners();
  }

  private calculateEffectivePrice(operation: string, count: number) {
    const target =
      operation === 'buy' ? this.orderBook.bid : this.orderBook.ask;

    let orderPrice = [...target.keys()].sort((k1, k2) => {
      if (k1 > k2) {return 1;}
      if (k1 < k2) {return -1;}
      return 0;
    });

    if (operation === 'sell') {
      orderPrice = orderPrice.reverse();
    }

    let auxiliarCount = count;
    let index = 0;
    let summatory = 0;

    while (auxiliarCount > 0 && index < orderPrice.length) {
      const countTarget = parseFloat(target.get(orderPrice[index]) || '0');
      const parsedOrderPrice = parseFloat(orderPrice[index]);

      if (auxiliarCount > countTarget) {
        summatory =
          summatory + (auxiliarCount - countTarget) * parsedOrderPrice;
        auxiliarCount = auxiliarCount - countTarget;
      } else {
        summatory = summatory + auxiliarCount * parsedOrderPrice;
        auxiliarCount = 0;
      }
      index++;
    }

    return summatory / count;
  }

  private updateOrderBook(updatedData: number[]) {
    if (updatedData[1] > 0) {
      if (updatedData[2] < 0) {
        this.orderBook.bid.set(
          updatedData[0].toString(),
          (Math.abs(updatedData[1])).toString()
        );
      } else {
        this.orderBook.ask.set(
          updatedData[0].toString(),
          (Math.abs(updatedData[1])).toString()
        );
      }
    } else {
      if (updatedData[2] >= 0) {
        this.orderBook.bid.delete(updatedData[0].toString());
      } else {
        this.orderBook.ask.delete(updatedData[0].toString());
      }
    }
  }

  private parseMessageOrderBook(msg: ws.RawData) {
    const parseResult = JSON.parse(msg.toString());
    if (Array.isArray(parseResult) && Array.isArray(parseResult[1])) {
      if (Array.isArray(parseResult[1][0])) {
        parseResult[1].forEach((result) => {
          this.updateOrderBook(result);
        });
      } else {
        const infoBook = parseResult[1];
        this.updateOrderBook(infoBook);
      }
    }
  }
}
