import { Controller, Get, Headers, Req } from '@nestjs/common';
import { I18nContext, I18n } from 'nestjs-i18n';

const { NAME, ENV } = process.env;

@Controller()
export class RootController {
    constructor() {}

    @Get()
    hello(@I18n() i18n: I18nContext, @Headers('accept-language') lang: string): string {
        return i18n.t('root.welcome', {
            args: { name: NAME, env: ENV },
            lang
        }) as unknown as string;
    }
}
