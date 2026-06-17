import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedApp: any;

export const bootstrap = async () => {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
};

const handler = async (req: any, res: any) => {
  const instance = await bootstrap();
  return instance(req, res);
};

export default handler;
