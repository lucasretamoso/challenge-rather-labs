import express from 'express';
import { router } from './listeners';
import expressWS from 'express-ws';
import { routerWeb } from './web';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/.env`
});

const appBase = express();
const wsInstance = expressWS(appBase);
const { app } = wsInstance; 

const routerExpress = express.Router();
router(routerExpress);
routerWeb(routerExpress);

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Start the project in this link: http://localhost:${process.env.EXPRESS_PORT}`);
});

app.use('/', routerExpress);