import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return {
    type: 'postgres',

    // ✅ PRODUCCIÓN (Render + Neon)
    ...(isProduction
      ? {
          url: configService.get<string>('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {
          // ✅ LOCAL
          host: configService.get<string>('DATABASE_HOST'),
          port: Number(configService.get('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASS'),
          database: configService.get<string>('DATABASE_NAME'),
          ssl: false,
        }),

    entities: [join(__dirname, '../../**/*.entity.{js,ts}')],
    synchronize: true, // ⚠️ solo dev; en prod ideal false
  };
};
