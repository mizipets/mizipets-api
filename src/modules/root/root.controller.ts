import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class RootController {
    constructor(private config: ConfigService) {}

    @Get()
    hello(): string {
        return `Welcome to ${this.config.get<string>(
            'NAME'
        )} in ${this.config.get<string>('ENV_NAME')} environment.`;
    }
}
