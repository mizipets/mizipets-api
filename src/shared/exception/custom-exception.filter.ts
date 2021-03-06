/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-10
 */
import {
    ExceptionFilter,
    Catch,
    HttpException,
    ArgumentsHost,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import * as HttpStatusCode from 'http-status-codes';
import { DiscordService } from '../discord/discord.service';
import { Logger } from '../logger/logger';

const { ENV } = process.env;

@Injectable()
@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    logger: Logger;

    constructor(private discordService: DiscordService) {
        this.logger = new Logger('ExceptionFilter');
    }

    async catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const request = host.switchToHttp().getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let exceptionMessage;
        if (typeof exception.getResponse !== 'undefined') {
            exceptionMessage = exception.getResponse();
        } else {
            exceptionMessage = {
                statusCode: status,
                message: exception.message ?? 'Internal Server Error',
                error: HttpStatusCode.getStatusText(status)
            };
        }

        const msgLines = [
            `:bangbang:**${this.toDiscordBadgeString('Error')}**:bangbang:`,
            `@Developper`,
            `**Mizipets API [${ENV}]** - ${request.hostname}`,
            `*${new Date().toLocaleString()}*`,
            `**${request.method}** \`\`${request.url}`,
            `\`\`IP: \`\`${request.ip}\`\``,
            ``,
            `**Error ${this.toDiscordBadgeNumber(
                status
            )}:** ${HttpStatusCode.getStatusText(status)}`,
            `\`\`\`${JSON.stringify(exceptionMessage, null, 2)}\`\`\``,
            `**Body:** ${
                request.user
                    ? '(user id: ' + request.user.id + ')'
                    : '(no user)'
            }`,
            `\`\`\`${JSON.stringify(
                this.sanitize(request.body),
                null,
                2
            )}\`\`\``,
            `--------------------------------------------------------------------`
        ];

        const msg = msgLines.join('\n');

        if (
            status !== HttpStatus.BAD_REQUEST &&
            status !== HttpStatus.CONFLICT &&
            status !== HttpStatus.UNAUTHORIZED &&
            status !== HttpStatus.NOT_FOUND &&
            status !== HttpStatus.FORBIDDEN &&
            status !== HttpStatus.TOO_MANY_REQUESTS &&
            status !== HttpStatus.PAYLOAD_TOO_LARGE
        ) {
            this.logger.error(
                `${Date().toString()}
                ${request.user ? '\nuid: ' + request.user.id : ''}
                \n${JSON.stringify(exceptionMessage, null, 2)}
                \n${exception.stack}`
            );
            if (ENV === 'prod' || ENV === 'staging')
                await this.discordService.sendMsg(msg);
        }
        return response.status(status).json(exceptionMessage);
    }

    sanitize(body: any): any {
        const passwordReplace = '**************';
        const res = {};
        if (body) {
            const entries = Object.entries(body);
            for (const entry of entries) {
                if (typeof entry[1] === 'object')
                    entry[1] = this.sanitize(entry[1]);
                else if (entry[0] === 'password') entry[1] = passwordReplace;
                res[entry[0]] = entry[1];
            }
        }
        return res;
    }

    toDiscordBadgeNumber(num: number): string {
        const numToString = new Map<number, string>();
        numToString.set(0, ':zero:');
        numToString.set(1, ':one:');
        numToString.set(2, ':two:');
        numToString.set(3, ':three:');
        numToString.set(4, ':four:');
        numToString.set(5, ':five:');
        numToString.set(6, ':six:');
        numToString.set(7, ':seven:');
        numToString.set(8, ':eight:');
        numToString.set(9, ':nine:');

        return num
            .toString()
            .split('')
            .map((digit) => numToString.get(parseInt(digit)))
            .join('');
    }

    toDiscordBadgeString(str: string): string {
        return str
            .toLowerCase()
            .split('')
            .map((chr) => `:regional_indicator_${chr}:`)
            .join('');
    }
}
