import { Router } from 'express-ws';
import path from 'path';

export const routerWeb = (r: Router) => {
  r.get('/', (_req, res) => {
    res.sendFile(path.resolve('src/public/index.html'));
  });

  r.get('/market-ticker', (_req, res) => {
    res.sendFile(path.resolve('src/public/marketTicker/index.html'));
  });

  r.get('/market-effective-price', (_req, res) => {
    res.sendFile(path.resolve('src/public/marketEfficientPrice/index.html'));
  });
};
