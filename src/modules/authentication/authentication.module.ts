import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
        PassportModule,
        UsersModule,
    ],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
