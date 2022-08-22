import { DataSource } from 'typeorm';
import { User } from 'entities/user';
import { AppRequest } from 'interfaces/app-request';
import { DeveloperCompany } from 'entities/developer-company';
import { NextFunction, Response } from 'express';

export function setRequestContext(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const developerCompanyRepository = dataSource.getRepository(DeveloperCompany);

  return async (req: AppRequest, res: Response, next: NextFunction) => {
    // should be in some jwt but here just plain headers for simplicity
    const userId = Number(req.headers['x-user-id']);
    const developerId = Number(req.headers['x-developer-id']);

    if (!isNaN(userId)) {
      const user = await userRepository.findOne({ where: { id: userId } });
      if (user) {
        req.user = user;

        if (!isNaN(developerId)) {
          const developer = await developerCompanyRepository.findOne({ where: { id: developerId, userId: user.id } });
          if (developer) {
            req.developer = developer;
          }
        }
      }
    }
    next();
  }
}
