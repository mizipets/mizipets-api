import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne
} from 'typeorm';
import { Specie } from '../../animals/entities/specie.entity';
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

    @ManyToOne(() => Specie, (specie) => specie.advices)
    specie: Specie;

    @Column('text')
    url: string;

    @Column('text')
    urlLabel: string;

    @CreateDateColumn()
    created: Date;
}
