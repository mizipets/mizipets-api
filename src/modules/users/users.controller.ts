import { Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Post } from '@nestjs/common';
import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import { identity } from 'rxjs';
import { User } from './user.entity';
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('')
    async getAll(@Res() res) {
        const token = await this.userService.getAll();
        return res.status(HttpStatus.OK).json(token);
    }

    @Get(':id/user')
    async getUserById(@Param('id')id, @Res() res) {
        const token = await this.userService.getById(id);
        return res.status(HttpStatus.OK).json(token);
    }

    @Get(':email/user')
    async getUserByEmail(@Param('email')email, @Res() res) {
        const token = await this.userService.getByEmail(email);
        return res.status(HttpStatus.OK).json(token);
    }

    @Post('create')
    async createUser(@Body() userData: User, @Res() res): Promise<any> {
        const token = await this.userService.create(userData);
        return res.status(HttpStatus.OK).json(token);
    }

    @Put(':id/update')
    async update(@Param('id')id, @Body() userData: User): Promise<any>{
        userData.id = id;
        return this.userService.update(userData);
    }

    @Put(':id/close')
    async close(@Param('id')id, @Body() userData: User): Promise<any> {
        userData.id = id;
        userData.closeDate = Date.prototype
        return this.userService.update(userData);
    }
}   
