import { WebSocket } from 'ws';

export const ErrorListener = (ws: WebSocket) => {
  ws.on('error', (error) => ws.send(error.message));
};