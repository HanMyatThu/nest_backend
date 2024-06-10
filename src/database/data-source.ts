import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import * as dotenvExpend from 'dotenv-expand';

dotenvExpend.expand(dotenv.config())

export default new DataSource({
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: true,
  logging: false,
})