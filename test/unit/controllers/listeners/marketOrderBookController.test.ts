/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock, instance, anything, verify, reset } from 'ts-mockito';
import { MarketOrderBookController } from '../../../../src/controllers/listeners/marketOrderBookController';
import { EffectivePriceDTO } from '../../../../src/data/DTOs/bitfinexOrderBookDTO';
import { BitfinexOrderBookService } from '../../../../src/services/bitfinexOrderBookService';
import { WebSocket } from 'ws';
import { OrdenBookEventEnum } from '../../../../src/data/enums/orderBookEventEnum';

const mockBitfinexOrderBookService = mock(BitfinexOrderBookService);
const mockBitfinexOrderBookServiceInstance = instance(
  mockBitfinexOrderBookService
);

const mockWebsocket = mock(WebSocket);
const mockWebsocketInstance = instance(mockWebsocket);

const marketOrderBookController = new MarketOrderBookController(
  mockBitfinexOrderBookServiceInstance
);

beforeEach(() => {
  reset(mockBitfinexOrderBookService);
  reset(mockWebsocket);
});

describe('MarketOrderBookController class', () => {
  describe('getEffectivePrice method', () => {
    it.each([
      { data: {} },
      { data: { symbol: 'testing' } },
      { data: { symbol: 'testing', count: '1' } },
    ])('Should fail if data ($data) is not complete', (data: any) => {
      marketOrderBookController.getEffectivePrice(data, mockWebsocketInstance);

      verify(
        mockBitfinexOrderBookService.getOrderbookByPairName(
          anything(),
          anything()
        )
      ).never();
      verify(mockWebsocket.emit('error', anything())).once();
      verify(
        mockWebsocket.emit(OrdenBookEventEnum.OrderBookEffectivePricePause)
      ).once();
    });

    it('Should execute the orderbook process', () => {
      const data: Partial<EffectivePriceDTO> = {
        symbol: 'testing',
        count: 1,
        operation: 'buy',
      };

      marketOrderBookController.getEffectivePrice(data, mockWebsocketInstance);

      verify(mockBitfinexOrderBookService.getOrderbookByPairName(anything(), mockWebsocketInstance)).once();
    });
  });

  describe('pauseMarketEffectivePrice method', () => {
    it('Should remove all handshaking', () => {
      marketOrderBookController.pauseMarketEffectivePrice();

      verify(mockBitfinexOrderBookService.removeAllHandshaking()).once();
    });
  });
});
