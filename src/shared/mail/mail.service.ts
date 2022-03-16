import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {User} from "../../modules/users/user.entity";


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  public async sendWelcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Mizipiets !',
      template: 'welcome',
      context: {
        firstname: user.firstname
      },
    });
  }

  public async sendResetCode(user: User, code: string) {
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

  public async sendChangedPassword(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mizipiets - Reset Password',
      template: 'changed-password',
      context: {
        firstname: user.firstname
      }
    });
  }
}
