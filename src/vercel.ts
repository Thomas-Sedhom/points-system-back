import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { Logger } from '@nestjs/common';

const logger = new Logger('VercelBootstrap');
const server = express();
let serverHandler: any;
let bootstrapPromise: Promise<void> | null = null;

async function bootstrap() {
  try {
    logger.log('Starting NestJS bootstrap...');
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    serverHandler = serverless(server);
    logger.log('NestJS bootstrap complete. Vercel server ready.');
  } catch (err) {
    logger.error('Failed to bootstrap on Vercel', err?.stack ?? err);
    throw err;
  }
}

async function handler(req: any, res: any) {
  if (!serverHandler) {
    if (!bootstrapPromise) {
      bootstrapPromise = bootstrap();
    }
    
    try {
      logger.log('Waiting for bootstrap to complete...');
      await bootstrapPromise;
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error: Bootstrap failed');
      return;
    }
  }

  return serverHandler(req, res);
}

// Export ESM-compatible handler and config for Vercel
export default handler;
export const config = {
  api: {
    externalResolver: true,
  },
};
