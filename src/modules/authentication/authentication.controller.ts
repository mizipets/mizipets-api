import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async createAccount(@Body() user: CreateUserDto) {
        return this.authService.register(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Get('token/refresh')
    async refreshToken(@Request() req) {
        return this.authService.refreshToken(req.user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('reset/password')
    async resetPassword(@Query('code') code: string, @Body() login: LoginDto) {
        return this.authService.resetPassword(login, code);
    }
}
