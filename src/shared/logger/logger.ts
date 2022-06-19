import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';

const { ENV } = process.env;

@Injectable()
export class Logger implements LoggerService {
    loki: WinstonLogger;

    constructor(private contextName: string = 'app') {
        const options = {
            batching: false,
            transports: [
                ENV === 'dev'
                    ? new transports.Console()
                    : new LokiTransport({
                          host: 'http://localhost:3100',
                          json: false,
                          labels: { job: 'api' }
                      })
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
                console.log('error logging');
            }
        );
    }
}
