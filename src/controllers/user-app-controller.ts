import { App } from 'entities/app';
import { AppListArgs } from 'dtos/app-list-args';
import { DataSource, Repository } from 'typeorm';
import { validateData } from 'helpers/validate-data';
import { SingleItemArgs } from 'dtos/single-item-args';
import { RequireUser } from 'decorators/require-user';
import { UserApp } from 'entities/user-app';
import { BadRequestException } from 'exceptions/bad-request-exception';
import { AppRequest } from 'interfaces/app-request';
import { PaymentTransaction } from 'entities/payment-transaction';

export class UserAppController {
  private appRepository: Repository<App>;
  private userAppRepository: Repository<UserApp>;
  private paymentTransactionRepository: Repository<PaymentTransaction>;

  constructor(private dataSource: DataSource, private configuration ={ commission: 0.4 }) {
    this.appRepository = dataSource.getRepository(App);
    this.userAppRepository = dataSource.getRepository(UserApp);
    this.paymentTransactionRepository = dataSource.getRepository(PaymentTransaction);
  }

  @RequireUser()
  async all(req: AppRequest): Promise<object[]> {
    const { limit, offset } = await validateData(AppListArgs, req.query);

    const queryBuilder =  this.appRepository.createQueryBuilder('app')
      .select(['app.id as id', 'app.name as name', 'app.icon as icon', 'app.shortDescription as "shortDescription"'])
      .innerJoin('app.userApp', 'userApp')
      .where('userApp.userId = :userId', { userId: req.user!.id })
      .andWhere('userApp.installed = true')
      .limit(limit)
      .offset(offset);

    return await queryBuilder.getRawMany();
  }

  @RequireUser()
  async stats(req: AppRequest): Promise<object | undefined> {
    const queryBuilder =  this.paymentTransactionRepository.createQueryBuilder('pt')
      .select(['SUM(pt.amountPaid) as "totalAmountPaid"'])
      .where('pt.userId = :userId', { userId: req.user!.id });

    return await queryBuilder.getRawOne();
  }

  @RequireUser()
  async install(req: AppRequest) {
    const { id: appId } = await validateData(SingleItemArgs, req.params);
    const userId = req.user!.id;
    const userApp = await this.userAppRepository.findOne({ where: { userId, appId } });
    const app = await this.appRepository.findOne({ where: { id: appId, published: true } });

    if (!app) {
      throw new BadRequestException('App doesn\'t exist');
    }

    if (userApp?.installed) {
      throw new BadRequestException('App installed');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      if (!userApp) {
        await this.userAppRepository.insert({ userId, appId, installed: true })
      } else {
        await this.userAppRepository.update({ userId, appId }, {
          installed: true
        });
      }
      if (app.price > 0) {
        await this.paymentTransactionRepository.insert({
          userId,
          appId,
          amountPaid: app.price,
          commissionAmount: app.price * this.configuration.commission,
        });
      }
      await queryRunner.commitTransaction();

      return { success: true };
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      throw ex;
    } finally {
      await queryRunner.release();
    }
  }

  @RequireUser()
  async uninstall(req: AppRequest) {
    const { id: appId } = await validateData(SingleItemArgs, req.params);
    const userId = req.user!.id;
    const userApp = await this.userAppRepository.findOne({ where: { userId, appId } });
    const app = await this.appRepository.findOne({ where: { id: appId } });

    if (!app) {
      throw new BadRequestException('App doesn\'t exist');
    }

    if (!userApp?.installed) {
      throw new BadRequestException('App is not installed');
    }

    await this.userAppRepository.update({ userId, appId }, {
      installed: false
    });

    return { success: true };
  }
}
