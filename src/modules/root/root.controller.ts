/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { Controller, Get } from '@nestjs/common';

const { NAME, ENV } = process.env;

@Controller()
export class RootController {
    @Get()
    hello(): string {
        return `Bienvenue à ${NAME} en environment ${ENV}.`;
    }
}
