/**
 * @author Julien DA CORTE
 * @create 2022-03-08
 */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendWelcome(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Mizipiets !',
            template: 'welcome',
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendResetCode(user: User, code: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Mizipiets - Reset Password',
            template: 'reset-password',
            context: {
                firstname: user.firstname,
                code: code
            }
        });
    }

    async sendChangedPassword(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Mizipiets - Reset Password',
            template: 'changed-password',
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendCloseAccount(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Mizipiets - Account closed',
            template: 'close-account',
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendNewConnection(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Mizipiets - New connection',
            template: 'new-connection',
            context: {
                firstname: user.firstname
            }
        });
    }
}
