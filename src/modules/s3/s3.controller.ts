/**
 * @author Julien DA CORTE
 * @create 2022-04-22
 */

import {
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Request,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Roles } from '../authentication/enum/roles.emum';

@Controller('upload')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post(':id')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async uploadFile(
        @Request() req,
        @Param('id') id: number,
        @Query('type') type: string,
        @UploadedFile() file: any
    ): Promise<any> {
        if (type !== 'avatar' && type !== 'animal')
            throw new ForbiddenException("Can't upload this file");
        return this.s3Service.uploadFile(req.user.id, id, type, file);
    }
}
