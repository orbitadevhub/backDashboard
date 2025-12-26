import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('DB URL RAW >>>', JSON.stringify(process.env.DATABASE_URL));

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('OrvitaDev-APIs')
    .setDescription('Docs de API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('Listening on port:', port);

  await app.listen(port);
}

bootstrap();

