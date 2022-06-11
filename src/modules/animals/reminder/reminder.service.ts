/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity.';
import { Specie } from '../entities/specie.entity';
import { EditReminderDto } from './dto/edit-reminder.dto';
import { ReminderDto } from './dto/reminder.dto';

@Injectable()
export class RemindersService {
    constructor(
        @InjectRepository(Specie) private repository: Repository<Reminder>
    ) {}

    async create(reminderDto: ReminderDto) {
        const reminder = new Reminder();
        reminder.name = reminderDto.name;
        reminder.isReccurent = reminderDto.isReccurent;
        reminder.reccurence = reminderDto.reccurence;
        reminder.start = reminderDto.start;

        return await this.repository.save(reminder);
    }

    async update(editReminderDto: EditReminderDto) {
        // const reminder = new Reminder();
        // reminder.name = reminderDto.name;
        // reminder.isReccurent = reminderDto.isReccurent;
        // reminder.reccurence = reminderDto.reccurence;
        // reminder.start = new Date();
        // return await this.repository.save(reminder);
    }
}
