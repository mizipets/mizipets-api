import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';
import { AdviceType } from '../enums/advice-type.enum';

@Entity('advices')
export class Advice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    content: string;

    @Column('text')
    type: AdviceType;

    @Column('text')
    imageUrl: string;

    @Column('text')
    url: string;

    @Column('text')
    urlLabel: string;

    @CreateDateColumn()
    created: Date;
}
