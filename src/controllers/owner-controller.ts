import { DataSource, Repository } from 'typeorm';
import { AppRequest } from 'interfaces/app-request';
import { PaymentTransaction } from 'entities/payment-transaction';
import { RequireUser } from 'decorators/require-user';
import { NotAuthorizedException } from 'exceptions/not-authorized-exception';

export class OwnerController {
  private paymentTransactionRepository: Repository<PaymentTransaction>;

  constructor(private dataSource: DataSource) {
    this.paymentTransactionRepository = dataSource.getRepository(PaymentTransaction);
  }

  @RequireUser()
  async stats(req: AppRequest): Promise<object | undefined> {
    if (!req.user!.isOwner) {
      throw new NotAuthorizedException('Insufficient permissions to access stats');
    }
    const queryBuilder =  this.paymentTransactionRepository.createQueryBuilder('pt')
      .select(['SUM(pt.commissionAmount) as "totalCommissionAmount"']);

    return await queryBuilder.getRawOne();
  }
}
