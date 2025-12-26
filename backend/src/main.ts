import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001','https://back-dashboard-l3xopkpgd-orbitadevs-projects-4ec97c99.vercel.app/'],
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
  await app.listen(port);
}

bootstrap();

