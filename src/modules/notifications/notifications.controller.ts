/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('user/:id')
    @ApiOkResponse({
        description: 'Notifications retrieved',
        type: [Notification]
    })
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async getByUser(@Param('id') id: number, @Query('offset') offset: number) {
        return this.notificationsService.getBy(
            {
                user: {
                    id: id
                }
            },
            offset ?? 0
        );
    }

    @Delete(':id')
    @ApiNoContentResponse({
        description: 'Notification deleted'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async delete(@Param('id') id: number) {
        await this.notificationsService.delete(id);
    }
}
