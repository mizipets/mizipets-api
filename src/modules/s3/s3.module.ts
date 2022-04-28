/**
 * @author Julien DA CORTE
 * @create 2022-04-22
 */

import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { UsersModule } from '../users/users.module';
import { AnimalsModule } from '../animals/animals.module';

@Module({
    imports: [UsersModule, AnimalsModule],
    providers: [S3Service],
    controllers: [S3Controller],
    exports: [S3Service]
})
export class S3Module {}
