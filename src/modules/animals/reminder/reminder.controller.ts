/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Roles } from '../../authentication/enum/roles.emum';
import { OnlyRoles } from '../../authentication/guards/role.decorator';
import { EditReminderDto } from './dto/edit-reminder.dto';
import { ReminderDto } from './dto/reminder.dto';
import { RemindersService } from './reminder.service';

@Controller('reminders')
export class RemindersController {
    constructor(private remindersService: RemindersService) {}

    @Post()
    @OnlyRoles(Roles.STANDARD)
    async create(@Body() reminderDto: ReminderDto) {
        this.remindersService.create(reminderDto);
    }

    @Put(':id')
    @OnlyRoles(Roles.STANDARD)
    async edit(@Body() editReminderDto: EditReminderDto) {
        this.remindersService.update(editReminderDto);
    }
}
