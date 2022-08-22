import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';

export class FakeData1660810903455 implements MigrationInterface {
  name = 'FakeData1660810903455'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await this.insertValues(
      queryRunner,
      'user',
      Array.from({ length: 20 }).map((_, idx) => ({
        email: faker.internet.email(),
        isOwner: idx === 0,
      }))
    );

    const companies = await this.insertValues(
      queryRunner,
      'developer_company',
      Array.from({ length: 10 }).map(() => ({
        name: faker.company.name(),
        url: faker.internet.url(),
        userId: users[Math.floor(users.length * Math.random())].id,
      }))
    );

    const apps = await this.insertValues(
      queryRunner,
      'app',
      Array.from({ length: 20 }).fill(null).map(() => ({
        developerId: companies[Math.floor(Math.random() * companies.length)].id,
        name: faker.commerce.productName(),
        icon: faker.internet.url(),
        shortDescription: faker.lorem.paragraph(1),
        longDescription: faker.lorem.paragraphs(),
        price: Math.round(Math.random() * 1000),
        published: Math.random() > 0.5,
      }))
    );

    const transactionsData: unknown[] = [];

    await this.insertValues(
      queryRunner,
      'user_app',
      users.flatMap(user => {
        const set = new Set<number>();
        Array.from({ length: Math.round(Math.random() * 5) }).forEach(() => {
          set.add(Math.floor(Math.random() * apps.length));
        });

        return [...set.values()].map(appIdx => {
          const app = apps[appIdx];
          transactionsData.push({
            userId: user.id,
            appId: app.id,
            amountPaid: app.price,
            commissionAmount: app.price * 0.4,
          });

          return {
            userId: user.id,
            appId: app.id,
            installed: Math.random() > 0.5,
          };
        });
      })
    );

    await this.insertValues(
      queryRunner,
      'payment_transaction',
      transactionsData,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "payment_transaction" CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE "app" CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE "developer_company" CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE "user" CASCADE`);
  }

  private async insertValues<T>(
    queryRunner: QueryRunner,
    tableName: string,
    items: T[],
    noId: boolean = false
  ): Promise<(T & { id: number})[]> {
    const fields = Object.keys(items[0]);
    const columns = fields.map(name => `"${name}"`).join(', ');
    const params: any[] = [];
    const values = items.map(item => '(' + fields.map(name => {
        params.push(item[name as keyof T]);
        return '$' + params.length
      }).join(', ') + ')').join(', ');
    const result = await queryRunner.query(
      `INSERT INTO "${tableName}" (${columns}) VALUES ${values}${noId ? '' : ' RETURNING id'}`,
      params
    );

    return noId ? items : items.map((item, idx) => Object.assign(item, result[idx]));
  }


}
