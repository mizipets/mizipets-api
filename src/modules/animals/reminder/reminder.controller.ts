/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { Roles } from '../../authentication/enum/roles.emum';
import { OnlyRoles } from '../../authentication/guards/role.decorator';
import { Reminder } from '../entities/reminder.entity';
import { EditReminderDto } from './dto/edit-reminder.dto';
import { ReminderDto } from './dto/reminder.dto';
import { RemindersService } from './reminder.service';

@Controller('reminders')
export class RemindersController {
    constructor(private remindersService: RemindersService) {}

    @Post()
    @OnlyRoles(Roles.STANDARD)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() reminderDto: ReminderDto) {
        return await this.remindersService.create(reminderDto);
    }

    @Put(':id')
    @OnlyRoles(Roles.STANDARD)
    async edit(@Body() reminder: Reminder) {
        return await this.remindersService.update(reminder);
    }

    @Delete(':id')
    @OnlyRoles(Roles.STANDARD)
    async delete(@Param('id') id: number) {
        return await this.remindersService.delete(id);
    }
}
