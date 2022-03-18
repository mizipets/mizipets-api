/**
 * @author Maxime d'Harboullé
 * @email maxime.dharboulle@gmail.com
 * @create date 2022-03-16 00:27:29
 * @modify date 2022-03-16 00:27:29
 * @desc [description]
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
    imports: [TypeOrmModule.forFeature([Service])],
    controllers: [ServicesController],
    providers: [ServicesService]
})
export class ServicesModule {}
