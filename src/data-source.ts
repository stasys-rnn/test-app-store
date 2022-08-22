import { DataSource } from 'typeorm';
import config from './config'

export const dataSource = new DataSource({
  type: config.DB_TYPE,
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    'src/entities/**/*.ts'
  ],
  migrations: [ 'src/migrations/**/*.ts' ],
});
