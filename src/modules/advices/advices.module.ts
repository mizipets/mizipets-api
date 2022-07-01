import { Module } from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { AdvicesController } from './advices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './entities/advices.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Advice]), UsersModule],
    providers: [AdvicesService],
    controllers: [AdvicesController]
})
export class AdvicesModule {}
