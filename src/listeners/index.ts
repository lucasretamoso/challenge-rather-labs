import { Router } from 'express-ws';
import { BadArgumentsException } from '../../data/errors/badArgumentsException';
import { ErrorListener } from './modulos/errorListener';
import { MarketTipsListener } from './modulos/marketTipsListener';

export const router = (r: Router) => {
  r.ws('/', function(ws) {
    MarketTipsListener(ws);
    ErrorListener(ws);

    ws.on('message', (event) => {
      try {
        const eventParsed = JSON.parse(event.toString());
        const type = eventParsed.type;

        ws.on('close', (code, reason) => {
          ws.send(`Session close. Code: ${code}. Reason: ${reason}`);
          ws.emit('market:tip:ob:pause');
        });

        if (ws.eventNames().find((eventName) => eventName === type)) {
          ws.emit(type, eventParsed.data);
        } else if (type === undefined) {
          ws.emit('error', new BadArgumentsException('The type field is necessary.'));
        } else {
          ws.emit('error', new BadArgumentsException(`Event not found. Event ${type}`));
        }
      } catch (err: unknown) {
        ws.emit('error', err);
      }
    });
  });
};