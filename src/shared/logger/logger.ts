import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import LokiTransport from 'winston-loki';

@Injectable()
export class Logger implements LoggerService {
    loki: WinstonLogger;

    labels = [{ env: 'dev' }, { env: 'prod' }];

    constructor(private contextName: string) {
        this.loki = createLogger();
        this.loki.add(
            new LokiTransport({
                host: 'http://localhost:3100',
                labels: { job: 'app' }
            })
        );
    }

    public log(message: any, ...optionalParams: any[]) {
        this.sendToLoki(message, 'error');
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
                console.log(error, level, message, meta);
            }
        );
    }
}
