/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('user/:id')
    getByUser(@Param('id') id: number, @Query('offset') offset: number) {
        return this.notificationsService.getBy(
            {
                user: {
                    id: id
                }
            },
            offset ?? 0
        );
    }
}
