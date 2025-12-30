import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProd = configService.get('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    ssl: isProd
      ? { rejectUnauthorized: false }
      : false,

    entities: isProd
      ? [join(__dirname, '/../**/*.entity.js')]
      : [join(__dirname, '/../**/*.entity.{ts,js}')],

    synchronize: false,
  };
};
