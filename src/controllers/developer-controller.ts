import { App } from 'entities/app';
import { AppListArgs } from 'dtos/app-list-args';
import { DataSource, Repository } from 'typeorm';
import { validateData } from 'helpers/validate-data';
import { SingleItemArgs } from 'dtos/single-item-args';
import { CreateAppDto } from 'dtos/create-app-dto';
import { UpdateAppDto } from 'dtos/update-app-dto';
import { RequireDeveloper } from 'decorators/require-developer';
import { AppRequest } from 'interfaces/app-request';
import { PaymentTransaction } from 'entities/payment-transaction';
import { NotFoundException } from 'exceptions/not-found-exception';
import { BadRequestException } from 'exceptions/bad-request-exception';
import { Response } from 'express';

export class DeveloperController {
  private appRepository: Repository<App>;
  private paymentTransactionRepository: Repository<PaymentTransaction>;

  constructor(private dataSource: DataSource) {
    this.appRepository = dataSource.getRepository(App);
    this.paymentTransactionRepository = dataSource.getRepository(PaymentTransaction);
  }

  @RequireDeveloper()
  async apps(req: AppRequest): Promise<object[]> {
    const { limit, offset } = await validateData(AppListArgs, req.query);

    const queryBuilder =  this.appRepository.createQueryBuilder('app')
      .select([
        'app.id',
        'app.name',
        'app.icon',
        'app.shortDescription',
        'app.published',
        'app.price',
      ])
      .where('app.developerId = :developerId', { developerId: req.developer!.id })
      .limit(limit)
      .offset(offset);

    return await queryBuilder.getMany();
  }

  @RequireDeveloper()
  async create(req: AppRequest, res: Response) {
    const appData = await validateData(CreateAppDto, req.body);
    res.status(201);

    return this.appRepository.save({ ...appData, developerId: req.developer!.id });
  }

  @RequireDeveloper()
  async update(req: AppRequest) {
    const appData = await validateData(UpdateAppDto, req.body);
    return this.updateApp(req, appData);
  }

  @RequireDeveloper()
  async publish(req: AppRequest) {
    return this.updateApp(req, {  published: true }, app => {
      if (app.published) {
        throw new BadRequestException('App is already published.');
      }
    });
  }

  @RequireDeveloper()
  async unpublish(req: AppRequest) {
    return this.updateApp(req, {  published: true }, app => {
      if (!app.published) {
        throw new BadRequestException('App is not published.');
      }
    });
  }

  @RequireDeveloper()
  async stats(req: AppRequest): Promise<object | undefined> {
    const queryBuilder =  this.paymentTransactionRepository.createQueryBuilder('pt')
      .select(['SUM(pt.amountPaid - pt.commissionAmount) as "totalAmountEarned"'])
      .innerJoin('pt.app', 'app')
      .where('app.developerId = :developerId', { developerId: req.developer!.id });

    return await queryBuilder.getRawOne();
  }

  private async updateApp(req: AppRequest, appData: UpdateAppDto, verify?: (app: App) => void) {
    const { id } = await validateData(SingleItemArgs, req.params);
    const app = await this.appRepository.findOne({ where: { id, developerId: req.developer!.id }});

    if (!app) {
      throw new NotFoundException('App not found.');
    }

    verify?.(app);

    return this.appRepository.save(Object.assign(app, appData));
  }
}
