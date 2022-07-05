/**
 * @author Maxime D'HARBOULLE & Julien DA CORTE
 * @create 2022-03-16
 */
import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';
import { ServiceType } from '../enums/service-type.enum';

@Entity('services')
export class Service {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column('text', { nullable: true })
    description: string;

    @ApiProperty()
    @Column()
    imagePath: string;

    @ApiProperty()
    @Column()
    serviceType: ServiceType;

    @ApiProperty()
    @Column()
    isActive: boolean;

    @ApiProperty()
    @CreateDateColumn()
    createDate: Date;
}
