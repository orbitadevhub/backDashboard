import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  ssl: isProd
    ? { rejectUnauthorized: false }
    : false,

  entities: isProd
    ? [join(__dirname, '/../**/*.entity.js')]
    : [join(__dirname, '/../**/*.entity.{ts,js}')],

  migrations: [join(__dirname, '/../migrations/*.{ts,js}')],

  synchronize: false, // SIEMPRE false con migraciones
});
