import { WebSocket } from 'ws';
import { marketOrderBookController } from '../../controllers';

export const MarketOrderBookListener = (ws: WebSocket) => {
  ws.on('ob:effective:price', (data) => marketOrderBookController.getEffectivePrice(data, ws));
};