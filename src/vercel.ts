import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({ origin: true, credentials: true });
  await app.init();
  return server;
};

const handler = async (req: any, res: any) => {
  const instance = await bootstrap();
  return instance(req, res);
};

export default handler;
