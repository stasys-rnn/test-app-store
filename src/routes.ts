import { AppController } from 'controllers/app-controller';
import { dataSource } from 'data-source';
import { NextFunction, Request, Response } from 'express';
import { UserAppController } from 'controllers/user-app-controller';
import { OwnerController } from 'controllers/owner-controller';
import { DeveloperController } from 'controllers/developer-controller';
import config from './config';

const appController = new AppController(dataSource);
const developerController = new DeveloperController(dataSource);
const ownerController = new OwnerController(dataSource);
const userAppController = new UserAppController(dataSource, { commission: config.OWNER_COMMISSION });

export interface RouteInterface {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  handler: (req: Request, res: Response, next: NextFunction) => unknown;
}

export const routes: RouteInterface[] = [
  {
    path: '/apps',
    method: 'get',
    handler: appController.all.bind(appController),
  },
  {
    path: '/apps/:id',
    method: 'get',
    handler: appController.one.bind(appController),
  },
  {
    path: '/developer/apps',
    method: 'get',
    handler: developerController.apps.bind(developerController),
  },
  {
    path: '/developer/apps',
    method: 'post',
    handler: developerController.create.bind(developerController),
  },
  {
    path: '/developer/apps/:id',
    method: 'put',
    handler: developerController.update.bind(developerController),
  },
  {
    path: '/developer/apps/:id/publish',
    method: 'put',
    handler: developerController.publish.bind(developerController),
  },
  {
    path: '/developer/apps/:id/unpublish',
    method: 'put',
    handler: developerController.unpublish.bind(developerController),
  },
  {
    path: '/developer/stats',
    method: 'get',
    handler: developerController.stats.bind(developerController),
  },
  {
    path: '/user/apps',
    method: 'get',
    handler: userAppController.all.bind(userAppController),
  },
  {
    path: '/user/apps/:id/install',
    method: 'put',
    handler: userAppController.install.bind(userAppController),
  },
  {
    path: '/user/apps/:id/uninstall',
    method: 'put',
    handler: userAppController.uninstall.bind(userAppController),
  },
  {
    path: '/user/stats',
    method: 'get',
    handler: userAppController.stats.bind(userAppController),
  },
  {
    path: '/owner/stats',
    method: 'get',
    handler: ownerController.stats.bind(userAppController),
  },
];
