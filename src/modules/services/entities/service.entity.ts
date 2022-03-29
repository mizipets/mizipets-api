/**
 * @author Maxime D'HARBOULLE
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

    @Column()
    type: ServiceType;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    created: Date;
}
