import { WebSocket } from 'ws';
import { marketTipsController } from '../../controllers';

export const MarketTickerListener = (ws: WebSocket) => {
  ws.on('market:ticker:ob:return', (data) => marketTipsController.getMarketTicker(data, ws));
  ws.on('market:ticker:ob:pause', () => marketTipsController.pauseMarketTicker());
};