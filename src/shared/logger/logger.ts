import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import {
    createLogger,
    Logger as WinstonLogger,
    transports,
    format
} from 'winston';

@Injectable()
export class Logger implements LoggerService {
    loki: WinstonLogger;

    labels = [{ env: 'dev' }, { env: 'prod' }];

    constructor(private contextName: string) {
        const options = {
            defaultMeta: { name: 'api' },
            // batching: true,
            // interval: 10,
            transports: [
                // new LokiTransport({
                //     host: 'http://localhost:3100',
                //     labels: { job: 'app' }
                // })
                new transports.Http({
                    host: 'http://localhost',
                    port: 3100,
                    path: '/'
                }),
                new transports.Console()
            ]
        };
        this.loki = createLogger(options);
    }

    public log(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'info');
    }

    public error(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'error');
    }

    public warn(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'warn');
    }

    public debug(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'debug');
    }

    public verbose(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'info');
    }

    public setLogLevels(levels: LogLevel[]) {
        return;
    }

    private sendToLoki(message: string, level: string): void {
        this.loki.log(
            level,
            message,
            (error?: any, level?: string, message?: string, meta?: any) => {
                console.log('error', error, level, message, meta);
            }
        );
    }
}
