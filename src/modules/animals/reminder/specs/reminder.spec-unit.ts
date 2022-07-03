/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-25
 */
import { Reminder } from '../entities/reminder.entity';

describe('Reminder', () => {
    describe('Reminder recurrence', () => {
        it('should be a daily reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'daily';

            const dates = [
                new Date('2022-06-10'),
                new Date('2022-06-11'),
                new Date('2022-06-12'),
                new Date('2022-06-13'),
                new Date('2022-06-14'),
                new Date('2022-06-15'),
                new Date('2022-06-16'),
                new Date('2022-06-17'),
                new Date('2022-06-18')
            ];

            for (const date of dates) {
                expect(reminder.isReminderAtDate(date)).toBe(true);
            }
        });

        it('should be a weekly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'weekly';

            expect(reminder.isReminderAtDate(new Date('2022-06-13'))).toBe(
                true
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-14'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-15'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-16'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-17'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-18'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-19'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-20'))).toBe(
                true
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-21'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-22'))).toBe(
                false
            );
            expect(reminder.isReminderAtDate(new Date('2022-06-23'))).toBe(
                false
            );
        });

        it('should be a monthly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'monthly';

            for (let i = 1; i <= 12; i++) {
                expect(reminder.isReminderAtDate(new Date(`2022-${i}-1`))).toBe(
                    true
                );
                for (let j = 2; j <= (i === 2 ? 28 : 30); j++) {
                    expect(
                        reminder.isReminderAtDate(new Date(`2022-${i}-${j}`))
                    ).toBe(false);
                }
            }
        });

        it('should be a bimonthly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'bimonthly';

            for (let i = 1; i <= 12; i++) {
                expect(reminder.isReminderAtDate(new Date(`2022-${i}-1`))).toBe(
                    i % 2 === 0 ? true : false
                );
                for (let j = 2; j <= (i === 2 ? 28 : 30); j++) {
                    expect(
                        reminder.isReminderAtDate(new Date(`2022-${i}-${j}`))
                    ).toBe(false);
                }
            }
        });

        it('should be a trimesterly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'trimesterly';

            for (let i = 1; i <= 12; i++) {
                expect(reminder.isReminderAtDate(new Date(`2022-${i}-1`))).toBe(
                    i % 4 === 0 ? true : false
                );
                for (let j = 2; j <= (i === 2 ? 28 : 30); j++) {
                    expect(
                        reminder.isReminderAtDate(new Date(`2022-${i}-${j}`))
                    ).toBe(false);
                }
            }
        });

        it('should be a semesterly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'semesterly';

            for (let i = 1; i <= 12; i++) {
                expect(reminder.isReminderAtDate(new Date(`2022-${i}-1`))).toBe(
                    i % 6 === 0 ? true : false
                );
                for (let j = 2; j <= (i === 2 ? 28 : 30); j++) {
                    expect(
                        reminder.isReminderAtDate(new Date(`2022-${i}-${j}`))
                    ).toBe(false);
                }
            }
        });

        it('should be a yearly reminder', async () => {
            const reminder = new Reminder();
            reminder.start = new Date(2022, 6, 10);
            reminder.recurrence = 'yearly';

            for (let i = 1; i <= 12; i++) {
                expect(reminder.isReminderAtDate(new Date(`2022-${i}-1`))).toBe(
                    i === 1 ? true : false
                );
                for (let j = 2; j <= (i === 2 ? 28 : 30); j++) {
                    expect(
                        reminder.isReminderAtDate(new Date(`2022-${i}-${j}`))
                    ).toBe(false);
                }
            }
        });
    });
});
