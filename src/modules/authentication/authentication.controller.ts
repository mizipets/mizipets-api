/**
 * @author Julien DA CORTE
 * @create 2022-03-05
 */
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtResponseDto } from './dto/jwt-response.dto';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Body() userDto: CreateUserDto): Promise<User> {
        return this.authService.register(userDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() login: LoginDto): Promise<JwtResponseDto> {
        return this.authService.login(login);
    }

    @Get('token/:id/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Param('id') id: number): Promise<JwtResponseDto> {
        return this.authService.refreshToken(id);
    }

    @Put('reset/password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async resetPassword(
        @Query('code') code: string,
        @Body() login: LoginDto
    ): Promise<void> {
        return this.authService.resetPassword(login, parseInt(code));
    }

    @Post('code/verify')
    @HttpCode(HttpStatus.OK)
    async checkCode(
        @Body() body: { email: string; code: number }
    ): Promise<boolean> {
        return this.authService.verifyCode(body.email, body.code);
    }

    @Post('code/send')
    @HttpCode(HttpStatus.NO_CONTENT)
    async sendCode(@Body() body: { email: string }): Promise<void> {
        return this.authService.sendCode(body.email);
    }
}
