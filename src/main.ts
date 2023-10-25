import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '@src/app.module';

import useSwaggerUIAuthStoragePlugin from './swagger_plugin';
import corsConfig from './cors.config';
import { SeederService } from './modules/seeder/seeder.service';
import { json } from 'express';
import { AllExceptionsFilter } from './all-exception.filter';
import { Logger } from 'winston';
import { LOGGER } from './constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsConfig,
    bodyParser: true,
  });
  app.use(json({ limit: '3mb' }));
  const configService = app.get(ConfigService);
  const enableSeed = configService.get<string>('app.enableSeed');
  if (enableSeed === 'true') {
    app
      .get(SeederService)
      .seedUser()
      .then(() => {
        console.debug('Seeding states complete!');
      })
      .catch((error) => {
        console.error('Seeding failed!');
      });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get<Logger>(LOGGER)));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const options = new DocumentBuilder()
    .setTitle('TEW API')
    .setDescription('API endpoints for TEW backend App- -')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/internal/doc', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  const port = configService.get<string>('port');
  const env = configService.get<string>('env');

  const server = await app.listen(port);

  server.setTimeout(1200000);
  console.log(`Server running on port ${port}`, 'Bootstrap');
  // eslint-disable-next-line
  console.log(`${env} app running on: ${await app.getUrl()}`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason);
});
bootstrap();
