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
        let subject = 'Mizipets - ';
        if (user.preferences.lang == 'fr')
            subject += 'Bienvenue chez Mizipets!';
        if (user.preferences.lang == 'en') subject += 'Welcome to Mizipiets !';

        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: `welcome-${user.preferences.lang}`,
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendResetCode(user: User, code: string) {
        let subject = 'Mizipets - ';
        if (user.preferences.lang == 'fr')
            subject += 'Recuperation Mot de passe';
        if (user.preferences.lang == 'en') subject += 'Reset Password';

        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: `reset-password-${user.preferences.lang}`,
            context: {
                firstname: user.firstname,
                code: code
            }
        });
    }

    async sendChangedPassword(user: User) {
        let subject = 'Mizipets - ';
        if (user.preferences.lang == 'fr')
            subject += 'Recuperation Mot de passe';
        if (user.preferences.lang == 'en') subject += ' Reset Password';

        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: `changed-password-${user.preferences.lang}`,
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendCloseAccount(user: User) {
        let subject = 'Mizipets - ';
        if (user.preferences.lang == 'fr') subject += 'Compte Fermé';
        if (user.preferences.lang == 'en') subject += 'Account closed';

        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: `close-account-${user.preferences.lang}`,
            context: {
                firstname: user.firstname
            }
        });
    }

    async sendNewConnection(user: User) {
        let subject = 'Mizipets - ';
        if (user.preferences.lang == 'fr') subject += 'Nouvelle connexion';
        if (user.preferences.lang == 'en') subject += 'New connection';

        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: `new-connection-${user.preferences.lang}`,
            context: {
                firstname: user.firstname
            }
        });
    }
}
