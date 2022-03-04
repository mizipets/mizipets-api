import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { compare, hash } from 'bcrypt';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    public async register(registrationData: any): Promise<User> {
        const emailCheck: User = await this.userService.getByEmail(
            registrationData.email
        );
        if (emailCheck)
            throw new ConflictException('This email already exists');

        registrationData.password = await hash(registrationData.password, 10);
        const user: User = await this.userService.create(registrationData);
        user.password = undefined;

        // await this.mailService.sendWelcome(account);
        return user;
    }

    public async login(login: LoginDto): Promise<JwtResponseDto> {
        const user: User = await this.userService.getByEmail(login.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordEquals: boolean = await compare(
            login.password,
            user.password
        );
        if (!isPasswordEquals)
            throw new UnauthorizedException('Invalid credentials');

        return this.getJwtPayload(user);
    }

    // public async refreshToken(token: any): Promise<JwtResponseDto> {
    //   const account: Account = await this.accountsService.getAccountById(token._id);
    //   if (!account)
    //     throw new ForbiddenException("Can't refresh token");
    //
    //   return this.getJwtPayload(account);
    // }
    //
    // public async sendCode(email: string): Promise<void> {
    //   const code = this.generateCode();
    //   const account: Account = await this.accountsService.getAccountByEmail(email);
    //
    //   if(!account)
    //     throw new NotFoundException('User does not exist!');
    //
    //   await this.accountsService.updateCode(account.email, code.toString());
    //   await this.mailService.sendResetCode(account, code.toString());
    // }
    //
    // public async checkCode(data: any): Promise<boolean> {
    //   const account: Account = await this.accountsService.getAccountByEmail(data.email);
    //
    //   if (!account)
    //     throw new NotFoundException('User does not exist!');
    //
    //   return account.code === data.code;
    // }
    //
    // public async resetPassword(login: LoginDto, code: string): Promise<Account> {
    //   const account: Account = await this.accountsService.getAccountByEmail(login.email);
    //
    //   if(!account)
    //     throw new NotFoundException('User does not exist!');
    //
    //   if(account.code !== code)
    //     throw new ForbiddenException('Invalid code!');
    //
    //   account.password = await hash(login.password, 10);
    //   await this.accountsService.updatePassword(account);
    //
    //   account.password = undefined;
    //
    //   await this.mailService.sendChangedPassword(account);
    //
    //   return account;
    // }
    //
    // private generateCode(): number {
    //   return Math.floor(100000 + Math.random() * 900000);
    // }

    private getJwtPayload(user: User): JwtResponseDto {
        const jwtPayload: JwtPayloadDto = {
            id: user.id,
            email: user.email
            // firstname: user.firstname,
            // lastname: user.lastname,
            // role: user.role,
            // createDate: user.createDate
        };

        return { token: this.jwtService.sign(jwtPayload) };
    }
}
