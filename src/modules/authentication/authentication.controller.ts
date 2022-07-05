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
    Query
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('register')
    @ApiCreatedResponse({
        description: 'User created',
        type: User
    })
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Body() userDto: CreateUserDto): Promise<User> {
        return this.authService.register(userDto);
    }

    @Post('login')
    @ApiOkResponse({
        description: 'Logged in',
        type: JwtResponseDto
    })
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() login: LoginDto,
        @Query('onlyRole') role: string
    ): Promise<JwtResponseDto> {
        return this.authService.login(login, role);
    }

    @Get('token/:id/refresh')
    @ApiOkResponse({
        description: 'Token refreshed',
        type: JwtResponseDto
    })
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Param('id') id: string,
        @Query('key') key: string
    ): Promise<JwtResponseDto> {
        return this.authService.refreshToken(parseInt(id), key);
    }

    @Put('reset/password')
    @ApiNoContentResponse({
        description: 'Password reset'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async resetPassword(@Body() login: ResetPasswordDto): Promise<void> {
        return this.authService.resetPassword(login);
    }

    @Post('code/verify')
    @ApiOkResponse({
        description: 'Code is correct',
        type: Boolean
    })
    @HttpCode(HttpStatus.OK)
    async checkCode(
        @Body() body: { email: string; code: number }
    ): Promise<boolean> {
        return this.authService.verifyCode(body.email, body.code);
    }

    @Post('code/send')
    @ApiNoContentResponse({
        description: 'Code sent'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async sendCode(@Body() body: { email: string }): Promise<void> {
        return this.authService.sendCode(body.email);
    }
}
