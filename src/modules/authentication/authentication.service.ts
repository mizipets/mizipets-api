/**
 * @author Julien DA CORTE
 * @create 2022-03-05
 */
import {
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User } from '../users/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { MailService } from '../../shared/mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DeviceService } from '../device/device.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UsersService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService,
        private readonly deviceService: DeviceService
    ) {}

    async register(registrationData: CreateUserDto): Promise<User> {
        const emailExist: boolean = await this.userService.isEmailExist(
            registrationData.email
        );

        if (emailExist)
            throw new ConflictException('This email already exists');

        registrationData.password = await hash(registrationData.password, 10);
        const user: User = await this.userService.create(registrationData);
        delete user.password;

        await this.mailService.sendWelcome(user);

        return user;
    }

    async login(login: LoginDto, role: string): Promise<JwtResponseDto> {
        const user: User = await this.userService.getByEmail(login.email, true);

        if (!user || user.closeDate)
            throw new UnauthorizedException('Invalid credentials');

        if (user && role && user.role !== role) {
            throw new UnauthorizedException(
                'You need to have a pro account to login'
            );
        }

        const isPasswordEquals: boolean = await compare(
            login.password,
            user.password
        );

        if (!isPasswordEquals)
            throw new UnauthorizedException('Invalid credentials');

        const devices = await this.deviceService.getByUserID(user.id);
        const deviceId = this.deviceService.getDeviceCheckedID(devices, login);

        if (devices.length > 0) {
            if (!deviceId) {
                await this.mailService.sendNewConnection(user);
                await this.deviceService.create(login, user);
            } else {
                await this.deviceService.update(deviceId);
            }
        } else {
            await this.deviceService.create(login, user);
        }

        const tokenInfo: RefreshToken =
            await this.userService.updateRefreshToken(user.id);
        return this.getJwtPayload(user, tokenInfo.refreshKey);
    }

    async refreshToken(
        id: number,
        refreshKey: string
    ): Promise<JwtResponseDto> {
        const user: User = await this.userService.getById(id, []);
        if (!user.refreshToken)
            throw new ConflictException(`No refresh key for user id: ${id}`);

        if (refreshKey !== user.refreshToken.refreshKey)
            throw new UnauthorizedException('Invalid refresh token');

        if (user.refreshToken.expireAt < new Date().getTime())
            throw new UnauthorizedException(
                'Refresh token was expired. Please sign in'
            );

        return this.getJwtPayload(user, user.refreshToken.refreshKey);
    }

    async sendCode(email: string): Promise<void> {
        const code = AuthenticationService.generateCode();
        const user: User = await this.userService.getByEmail(email);

        await this.userService.updateCode(user.id, code);
        await this.mailService.sendResetCode(user, code.toString());
    }

    async verifyCode(email: string, code: number): Promise<boolean> {
        const user: User = await this.userService.getByEmail(email);
        const isCodeValid: boolean = AuthenticationService.checkCode(
            user.code,
            code
        );

        if (!isCodeValid) throw new ForbiddenException('Invalid code!');

        return isCodeValid;
    }

    async resetPassword(login: LoginDto, code: number): Promise<void> {
        const user: User = await this.userService.getByEmail(login.email);
        const isCodeValid: boolean = AuthenticationService.checkCode(
            user.code,
            code
        );

        if (!isCodeValid) throw new ForbiddenException('Invalid code!');

        user.password = await hash(login.password, 10);
        await this.userService.updatePassword(user.id, user.password);
        user.password = undefined;
        await this.mailService.sendChangedPassword(user);
    }

    private static checkCode(userCode: number, code: number): boolean {
        return userCode === code;
    }

    private static generateCode(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

    private getJwtPayload(user: User, refreshToken: string): JwtResponseDto {
        const jwtPayload: JwtPayloadDto = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role
        };

        return {
            token: this.jwtService.sign(jwtPayload),
            refreshKey: refreshToken
        };
    }
}
