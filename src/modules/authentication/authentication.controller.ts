import {Body, Controller, Get, HttpStatus, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import {AuthenticationService} from './authentication.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {LoginDto} from './dto/login.dto';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";


@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  async createAccount(@Res() res, @Body() account: CreateUserDto) {
    const registeredAccount = await this.authService.register(account);
    return res.status(HttpStatus.CREATED).json(registeredAccount);
  }

  @Post('login')
  async login(@Res() res, @Body() login: LoginDto) {
    const token = await this.authService.login(login);
    return res.status(HttpStatus.OK).json(token);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('token/refresh')
  // async refreshToken(@Res() res, @Request() req) {
  //   const token = await this.authService.refreshToken(req.user);
  //   return res.status(HttpStatus.OK).json(token);
  // }
  //
  // @Post('reset/password')
  // async resetPassword(@Res() res, @Query('code') code: string, @Body() login: LoginDto) {
  //   const account = await this.authService.resetPassword(login, code);
  //   return res.status(HttpStatus.OK).json(account);
  // }
}
