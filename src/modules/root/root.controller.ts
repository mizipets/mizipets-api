/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";

const { NAME, ENV } = process.env;

@ApiTags('Root')
@Controller()
export class RootController {
    @Get()
    hello(): string {
        return `Welcome to ${NAME}. The current environment is ${ENV}.`;
    }
}
