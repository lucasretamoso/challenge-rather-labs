/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock, instance, anything, verify, reset } from 'ts-mockito';
import { WebSocket } from 'ws';
import { MarketTipsController } from '../../../../src/controllers/listeners/marketTipsController';
import { BitfinexService } from '../../../../src/services/bitfinexService';
import { BitfinexMessageDTO } from '../../../../src/data/DTOs/bitfinexMessageDTO';
import { MarketEventEnum } from '../../../../src/data/enums/marketEventEnum';

const mockBitfinexService = mock(BitfinexService);
const mockBitfinexServiceInstance = instance(
  mockBitfinexService
);

const mockWebsocket = mock(WebSocket);
const mockWebsocketInstance = instance(mockWebsocket);

const marketTipsController = new MarketTipsController(
  mockBitfinexServiceInstance
);

beforeEach(() => {
  reset(mockBitfinexService);
  reset(mockWebsocket);
});

describe('MarketTipsController class', () => {
  describe('getMarketTicker method', () => {
    it('Should fail if symbol does not exist', () => {
      marketTipsController.getMarketTicker({}, mockWebsocketInstance);

      verify(
        mockBitfinexService.getTickerByPairName(
          anything(),
          anything()
        )
      ).never();
      verify(mockWebsocket.emit('error', anything())).once();
      verify(
        mockWebsocket.emit(MarketEventEnum.MarketTickerPause)
      ).once();
    });

    it('Should execute the ticker process', () => {
      const data: Partial<BitfinexMessageDTO> = {
        symbol: 'testing'
      };

      marketTipsController.getMarketTicker(data, mockWebsocketInstance);

      verify(mockBitfinexService.getTickerByPairName(anything(), mockWebsocketInstance)).once();
    });
  });

  describe('pauseMarketTicker method', () => {
    it('Should remove all handshaking', () => {
      marketTipsController.pauseMarketTicker();

      verify(mockBitfinexService.removeAllHandshaking()).once();
    });
  });
});
