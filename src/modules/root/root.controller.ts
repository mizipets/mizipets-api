import { Controller, Get } from '@nestjs/common';

const { NAME, ENV } = process.env;
@Controller()
export class RootController {
    constructor() {}

    @Get()
    hello(): string {
        return `Welcome to ${NAME} in ${ENV} environment.`;
    }
}
