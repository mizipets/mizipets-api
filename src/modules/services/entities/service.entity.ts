/**
 * @author Maxime D'HARBOULLE & Julien DA CORTE
 * @create 2022-03-16
 */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';
import { ServiceType } from '../enums/service-type.enum';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column()
    imagePath: string;

    @Column()
    serviceType: ServiceType;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createDate: Date;
}
