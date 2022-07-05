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
import { Reminder } from './entities/reminder.entity';
import { ReminderDto } from './dto/reminder.dto';
import { RemindersService } from './reminder.service';
import { ApiCreatedResponse, ApiTags, ApiOkResponse } from '@nestjs/swagger';
@ApiTags('Reminders')
@Controller('reminders')
export class RemindersController {
    constructor(private remindersService: RemindersService) {}

    @Post()
    @ApiCreatedResponse({
        description: 'Reminder created',
        type: Reminder
    })
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() reminderDto: ReminderDto): Promise<Reminder> {
        return await this.remindersService.create(reminderDto);
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'Reminder updated',
        type: Reminder
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async edit(@Body() reminder: Reminder): Promise<Reminder> {
        return await this.remindersService.update(reminder);
    }

    @Delete(':id')
    @ApiOkResponse({
        description: 'Reminder deleted',
        type: Reminder
    })
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async delete(@Param('id') id: number) {
        return await this.remindersService.delete(id);
    }
}
