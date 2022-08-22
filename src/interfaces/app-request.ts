import { Request as BaseRequest } from 'express';
import { User } from 'entities/user';
import { DeveloperCompany } from 'entities/developer-company';

export interface AppRequest extends BaseRequest {
  user?: User;
  developer?: DeveloperCompany;
}
