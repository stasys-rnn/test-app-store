import { App } from 'entities/app';
import { AppListArgs } from 'dtos/app-list-args';
import { DataSource, Repository } from 'typeorm';
import { validateData } from 'helpers/validate-data';
import { SingleItemArgs } from 'dtos/single-item-args';
import { AppRequest } from 'interfaces/app-request';
import { Request } from 'express';
import { NotFoundException } from 'exceptions/not-found-exception';

export class AppController {
  private appRepository: Repository<App>;

  constructor(private dataSource: DataSource) {
    this.appRepository = dataSource.getRepository(App);
  }

  async all(req: AppRequest): Promise<object[]> {
    const { limit, offset } = await validateData(AppListArgs, req.query);

    const queryBuilder =  this.appRepository.createQueryBuilder('app')
      .select(['app.id as id', 'app.name as name', 'app.icon as icon', 'app.shortDescription as "shortDescription"'])
      .where('app.published = true')
      .limit(limit)
      .offset(offset);

    if (req.user) {
      queryBuilder
        .leftJoin('app.userApp', 'user_app', 'user_app.userId = :userId', { userId: req.user.id })
        .addSelect([ '(CASE WHEN user_app.installed IS NULL THEN false ELSE user_app.installed END) as installed' ]);
    }

    return await queryBuilder.getRawMany();
  }

  async one(req: Request) {
    const { id } = await validateData(SingleItemArgs, req.params);

    const app = await this.appRepository.findOne({
      select: [ 'id', 'name', 'icon', 'shortDescription', 'longDescription' ],
      join: { innerJoinAndSelect: { 'dev': 'app.developer' }, alias: 'app' },
      where: { id, published: true }
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    return app;
  }
}
