import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),

    ssl: {
      rejectUnauthorized: false,
    },

    entities: [
      join(__dirname, '/../**/*.entity.{ts,js}'),
    ],

    synchronize: false,
  };
};