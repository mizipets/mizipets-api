/**
 * @author Julien DA CORTE
 * @create 2022-03-05
 */
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { MailService } from '../../shared/mail/mail.service';
import {CreateUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UsersService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
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

    async login(login: LoginDto): Promise<JwtResponseDto> {
        const user: User = await this.userService.getByEmail(login.email, true);

        if (!user || user.closeDate) throw new UnauthorizedException('Invalid credentials');

        const isPasswordEquals: boolean = await compare(
            login.password,
            user.password
        );

        if (!isPasswordEquals)
            throw new UnauthorizedException('Invalid credentials');

        return this.getJwtPayload(user);
    }

    async refreshToken(currentUser: User): Promise<JwtResponseDto> {
        const user: User = await this.userService.getById(currentUser.id);
        return this.getJwtPayload(user);
    }

    // async sendCode(email: string): Promise<void> {
    //   const code = this.generateCode();
    //   const account: Account = await this.accountsService.getAccountByEmail(email);
    //
    //   if(!account)
    //     throw new NotFoundException('User does not exist!');
    //
    //   await this.accountsService.updateCode(account.email, code.toString());
    //   await this.mailService.sendResetCode(account, code.toString());
    // }

    // public async checkCode(data: any): Promise<boolean> {
    //   const account: Account = await this.accountsService.getAccountByEmail(data.email);
    //
    //   if (!account)
    //     throw new NotFoundException('User does not exist!');
    //
    //   return account.code === data.code;
    // }

    async resetPassword(login: LoginDto, code: string): Promise<User> {
        const user: User = await this.userService.getByEmail(login.email);

        if (!user) throw new NotFoundException('User does not exist!');

        // if(user.code !== code) throw new ForbiddenException('Invalid code!');

        user.password = await hash(login.password, 10);

        // await this.userService.updatePassword(user);

        user.password = undefined;

        await this.mailService.sendChangedPassword(user);
        return user;
    }

    // private generateCode(): number {
    //     return Math.floor(100000 + Math.random() * 900000);
    // }

    private getJwtPayload(user: User): JwtResponseDto {
        const jwtPayload: JwtPayloadDto = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role
        };

        return {
            token: this.jwtService.sign(jwtPayload)
        };
    }
}
