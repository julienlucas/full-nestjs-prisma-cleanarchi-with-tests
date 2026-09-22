/**
 * Point d'entrée serverless (Vercel).
 *
 * `src/main.ts` appelle `app.listen(port)` : un serveur qui écoute un port, ce
 * qu'une fonction serverless ne peut pas faire. Ici, Nest est initialisé une
 * seule fois par instance (réutilisée entre deux invocations à chaud) et la
 * requête est passée directement à Fastify.
 *
 * `src/main.ts` reste le point d'entrée du dev local (`pnpm start:dev`).
 */
import type { IncomingMessage, ServerResponse } from 'http';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TransformInterceptor } from '@infrastructure/common/transform.interceptor';

let instance: Promise<any> | null = null;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const options = new DocumentBuilder()
    .setTitle('E-learning courses API')
    .setDescription('Nestjs API')
    .setVersion('1.0')
    .addTag('Your API Tag')
    .build();

  // Pas de fs.writeFileSync de api-spec.json ici : le filesystem est en lecture
  // seule en serverless (ce fichier est généré par le dev local).
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, options));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();

  const fastify = app.getHttpAdapter().getInstance();
  await fastify.ready();
  return fastify;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    instance = instance ?? bootstrap();
    const fastify = await instance;
    fastify.server.emit('request', req, res);
  } catch (error) {
    // Un bootstrap raté (base injoignable, variable d'env manquante) ne doit pas
    // rester en cache : sans ce reset, l'instance sert des erreurs jusqu'à son
    // recyclage. Et sans ce catch, la promesse rejetée tue la fonction.
    instance = null;
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ statusCode: 500, message: 'Service unavailable' }));
    console.error('[serverless] bootstrap failed', error);
  }
}
