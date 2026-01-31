import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedServer: any;

async function bootstrap() {
  if (cachedServer) return cachedServer;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.enableCors();
  await app.init();

  cachedServer = server;
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}
