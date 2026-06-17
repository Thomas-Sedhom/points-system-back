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
    // Log environment variables (excluding sensitive parts)
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      const maskedUri = mongoUri.replace(/\/\/.*:.*@/, '//***:***@');
      logger.log(`MONGO_URI is set: ${maskedUri}`);
    } else {
      logger.warn('MONGO_URI is NOT set. Falling back to hardcoded default.');
    }

    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    serverHandler = serverless(server);
    logger.log('NestJS bootstrap complete. Vercel server ready.');
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : 'No stack trace';
    logger.error(`Failed to bootstrap on Vercel: ${errorMsg}`, errorStack);
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
      const errorMsg = err instanceof Error ? err.message : String(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Bootstrap failed',
        message: errorMsg,
        stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : null) : undefined
      }));
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
