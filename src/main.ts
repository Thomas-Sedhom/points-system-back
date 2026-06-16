import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  // Keep Nest's CORS helper but also add explicit middleware to ensure
  // preflight (OPTIONS) requests get the proper headers on all deployments.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use((req: any, res: any, next: any) => {
    logger.log(`Incoming ${req.method} ${req.url} origin=${req.headers.origin}`);
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      // Log and short-circuit preflight
      logger.log(`Responding to preflight for ${req.url}`);
      return res.status(204).end();
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
