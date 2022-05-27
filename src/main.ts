/**
 * @author Maxime D'HARBOULLE & Julien DA CORTE
 * @create 2022-02-14
 */
import './initEnv';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as admin from 'firebase-admin';
import { CustomExceptionFilter } from './shared/exception/custom-exception.filter';
import { DiscordService } from './shared/discord/discord.service';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const origins = ['http://localhost:4200'];

    app.enableCors({ origin: origins });
    app.use(compression());
    app.use(helmet());
    app.setGlobalPrefix(process.env.API_PREFIX);
    app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
    app.use(morgan('tiny'));
    app.useGlobalFilters(
        new CustomExceptionFilter(app.get<DiscordService>(DiscordService))
    );

    const config = new DocumentBuilder()
        .setTitle('Mizipets API')
        .setDescription(
            'Mizipets is a mobile application providing services for pets'
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
