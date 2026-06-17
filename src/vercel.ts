import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('VercelBootstrap');
const server = express();
let bootstrapPromise: Promise<any> | null = null;

async function bootstrap() {
  try {
    logger.log('Starting NestJS bootstrap...');
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    logger.log('NestJS bootstrap complete. Vercel server ready.');
    return server;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error(`Failed to bootstrap on Vercel: ${errorMsg}`);
    throw err;
  }
}

async function handler(req: any, res: any) {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  
  try {
    const expressInstance = await bootstrapPromise;
    return expressInstance(req, res);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Bootstrap failed',
      message: errorMsg
    }));
  }
}

// Export ESM-compatible handler and config for Vercel
export default handler;
export const config = {
  api: {
    externalResolver: true,
  },
};
