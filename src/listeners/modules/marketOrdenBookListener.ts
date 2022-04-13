import { WebSocket } from 'ws';
import { marketOrderBookController } from '../../controllers';
import { OrdenBookEventEnum } from '../../data/enums/orderBookEventEnum';

export const MarketOrderBookListener = (ws: WebSocket) => {
  ws.on(OrdenBookEventEnum.OrderBookEffectivePrice, (data) => marketOrderBookController.getEffectivePrice(data, ws));
  ws.on(OrdenBookEventEnum.OrderBookEffectivePricePause, () => marketOrderBookController.pauseMarketEffectivePrice());
};