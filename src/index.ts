import express from 'express';
import { router } from './listeners';
import expressWS from 'express-ws';
import { routerWeb } from './web';

const appBase = express();
const wsInstance = expressWS(appBase);
const { app } = wsInstance; 

const routerExpress = express.Router();
router(routerExpress);
routerWeb(routerExpress);

app.listen(3000, () => {
  console.log('listening on *:3000');
});

app.use('/', routerExpress);