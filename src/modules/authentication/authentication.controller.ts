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
    Post,
    Query,
    Request
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OnlyRoles } from './guards/role.decorator';
import { Roles } from './enum/roles.emum';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }

    @Get('token/refresh')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN, Roles.API)
    async refreshToken(@Request() req) {
        return this.authService.refreshToken(req.user);
    }

    @Post('reset/password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Query('code') code: string, @Body() login: LoginDto) {
        return this.authService.resetPassword(login, code);
    }
}
