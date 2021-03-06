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
import compression from 'compression';
import morgan from 'morgan';
import { CustomExceptionFilter } from './shared/exception/custom-exception.filter';
import { DiscordService } from './shared/discord/discord.service';
import { Logger } from './shared/logger/logger';

const { ENV, PORT, NAME } = process.env;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new Logger()
    });
    const origins = [
        'http://localhost:4200',
        'https://staging.mizipets.com',
        'https://www.staging.mizipets.com',
        'https://mizipets.com',
        'https://www.mizipets.com'
    ];

    app.enableCors({ origin: origins });
    app.use(compression());
    app.use(helmet());
    app.setGlobalPrefix(process.env.API_PREFIX);
    app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
    if (true || ENV === 'local') {
        app.use(morgan('tiny'));
    }
    app.useGlobalFilters(
        new CustomExceptionFilter(app.get<DiscordService>(DiscordService))
    );

    const config = new DocumentBuilder()
        .setTitle(`${NAME}`)
        .setDescription(
            'Mizipets is a mobile application that promotes animal well-being providing different services.'
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT || 3000);
}

bootstrap();
