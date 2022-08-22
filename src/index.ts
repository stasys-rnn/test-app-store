import express, { Express, NextFunction, Request, Response } from 'express';
import { dataSource } from 'data-source';
import { setRequestContext } from 'middlewares/set-request-context';
import { RouteInterface, routes } from 'routes';
import { HttpException } from 'exceptions/http-exception';
import config from 'config'
import * as bodyParser from 'body-parser';

dataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('AppStore!');
});

app.use(setRequestContext(dataSource));

routes.forEach((route: RouteInterface) => {
  app[route.method](route.path, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await route.handler(req, res, next);
      if (result !== undefined) {
        res.json(result)
      }
    } catch (ex) {
      console.error(ex);
      if (ex instanceof HttpException) {
        res.status(ex.httpCode).send({ message: ex.message });
      } else {
        res.status(500).send({
          message: 'Internal error occured',
            ...(process.env.NODE_ENV === 'production' ? {} : { exception: String(ex) } ),
        });
      }
    }
  });
});

app.listen(config.PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${config.PORT}`);
});
