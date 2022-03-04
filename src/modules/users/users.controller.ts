import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('')
    async getAll(@Res() res) {
        const token = await this.userService.getAll();
        return res.status(HttpStatus.OK).json(token);
    }
}
