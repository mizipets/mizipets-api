/**
 * @author Julien DA CORTE
 * @create 2022-03-05
 */
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus, Param,
    Post,
    Query,
    Request
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OnlyRoles } from './guards/role.decorator';
import { Roles } from './enum/roles.emum';
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

    @Post('reset/password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Query('code') code: number,
        @Body() login: LoginDto
    ): Promise<User> {
        return this.authService.resetPassword(login, code);
    }

    @Post('code/send')
    @HttpCode(HttpStatus.NO_CONTENT)
    async sendCode(@Body() body: {email: string}): Promise<void> {
        return this.authService.sendCode(body.email)
    }
}
