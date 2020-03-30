import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import cors from 'cors';
import cookieParser from 'cookie-parser';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(cors(corsOptions));

  await app.listen(4000);
}

bootstrap();
