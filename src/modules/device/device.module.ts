/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
 import { Module } from '@nestjs/common';
 import { DeviceController } from './device.controller';
 import { DeviceService } from './device.service';
 import { TypeOrmModule } from '@nestjs/typeorm';
 import { Device } from './entities/device.entity';
 import { MailModule } from '../../shared/mail/mail.module';
 
 @Module({
     imports: [
         TypeOrmModule.forFeature([Device]),
         MailModule,
     ],
     controllers: [DeviceController],
     providers: [DeviceService],
     exports: [DeviceService]
 })
 export class DeviceModule {}
 