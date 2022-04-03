import { WebSocket } from 'ws';
import { marketTipsController } from '../../controllers';

export const MarketTipsListener = (ws: WebSocket) => {
  ws.on('market:tip:ob:return', (data) => marketTipsController.getMarketTips(data, ws));
  ws.on('market:tip:ob:pause', () => marketTipsController.pauseMarketTips());
};