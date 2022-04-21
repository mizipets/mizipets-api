import {Controller, HttpCode, HttpStatus, Post, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { S3Service } from './s3.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {OnlyRoles} from "../authentication/guards/role.decorator";
import {Roles} from "../authentication/enum/roles.emum";


@Controller('upload')
export class S3Controller {

    constructor(private readonly s3Service: S3Service) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async uploadFile(@Req() req, @UploadedFile() file: any) {
        return this.s3Service.uploadFile(req.user.id, file);
    }
}
