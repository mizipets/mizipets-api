import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = ['http://localhost'];
  app.enableCors({
    origin: origins,
  });

  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny'));

  const config = new DocumentBuilder()
    .setTitle('Pet finder API')
    .setDescription('The Pet finder API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
