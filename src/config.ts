import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DB_TYPE: Joi.string().default('postgres'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5438),
  DB_USERNAME: Joi.string().default('appstore'),
  DB_PASSWORD: Joi.string().default('appstore'),
  DB_NAME: Joi.string().default('appstore'),
  OWNER_COMMISSION: Joi.number().min(0).max(1).default(0),
});

const { value } = schema.validate(process.env);

export interface ConfigInterface {
  PORT: number,
  DB_TYPE: 'postgres' | 'mysql',
  DB_HOST: string,
  DB_PORT: number,
  DB_USERNAME: string,
  DB_PASSWORD: string,
  DB_NAME: string,
  OWNER_COMMISSION: number,
}

export default value as ConfigInterface;


