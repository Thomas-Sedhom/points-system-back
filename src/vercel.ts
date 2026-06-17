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

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    serverHandler = serverless(server);
    logger.log('Vercel server ready');
  } catch (err) {
    logger.error('Failed to bootstrap on Vercel', err?.stack ?? err);
  }
}

bootstrap();

async function handler(req: any, res: any) {
  if (!serverHandler) {
    logger.warn('Server handler not ready yet');
    res.statusCode = 502;
    res.end('Server initializing');
    return;
  }

  return serverHandler(req, res);
}

// Export as CommonJS for Vercel's loader to consume safely.
(module as any).exports = handler;
// Provide an ESM-style `config` export so Vercel recognizes configuration
// while keeping the CommonJS handler export for the runtime loader.
export const config = { };
(module as any).exports = handler;
