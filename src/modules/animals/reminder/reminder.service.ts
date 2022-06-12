/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ReminderDto } from './dto/reminder.dto';

@Injectable()
export class RemindersService {
    constructor(
        @InjectRepository(Reminder) private repository: Repository<Reminder>
    ) {}

    async create(reminderDto: ReminderDto) {
        const reminder = new Reminder();
        reminder.name = reminderDto.name;
        reminder.isReccurent = reminderDto.isReccurent;
        reminder.recurrence = reminderDto.recurrence;
        reminder.start = reminderDto.start;
        reminder.isOn = true;

        const reminderSave = Object.assign(
            {
                animal: {
                    id: reminderDto.animalId
                }
            },
            reminder
        );
        const created = await this.repository.save(reminderSave);
        return await this.repository.findOne(created.id);
    }

    async getAllWhere(where: FindConditions<Reminder>) {
        return await this.repository.find({
            where: where,
            relations: ['animal']
        });
    }

    async update(reminder: Reminder) {
        await this.repository.update(reminder.id, reminder);
        return await this.repository.findOne(reminder.id);
    }

    async delete(id: number) {
        return await this.repository.delete({
            id: id
        });
    }
}
