import { WebSocket } from 'ws';
import { marketTipsController } from '../../controllers';
import { MarketEventEnum } from '../../data/enums/marketEventEnum';

export const MarketTickerListener = (ws: WebSocket) => {
  ws.on(MarketEventEnum.MarketTickerReturn, (data) => marketTipsController.getMarketTicker(data, ws));
  ws.on(MarketEventEnum.MarketTickerPause, () => marketTipsController.pauseMarketTicker());
};