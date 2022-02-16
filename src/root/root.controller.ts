import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class RootController {
  constructor(private config: ConfigService) {}

  @Get()
  hello(): string {
    // eslint-disable-next-line prettier/prettier
    return `Welcome to the ${this.config.get<string>('NAME')} in ${this.config.get<string>('ENV_NAME')}.`;
  }
}
