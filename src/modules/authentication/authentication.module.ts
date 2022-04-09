/**
 * @author Julien DA CORTE
 * @create 2022-03-05
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { MailModule } from '../../shared/mail/mail.module';

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const JWT_CONFIG = {
    secret: JWT_SECRET,
    signOptions: { expiresIn: JWT_EXPIRATION }
};

@Module({
    imports: [
        JwtModule.register(JWT_CONFIG),
        PassportModule,
        UsersModule,
        MailModule
    ],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController]
})
export class AuthenticationModule {}
