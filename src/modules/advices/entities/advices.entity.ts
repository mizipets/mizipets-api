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
    type: AdviceType;

    @Column('text')
    imageUrl: string;

    @ManyToOne(() => Specie, (specie) => specie.advices)
    specie: Specie;

    @Column('text')
    url: string;

    @Column({
        type: 'jsonb',
        array: false,
        nullable: false
    })
    langContent: AdviceContentLang[];

    @CreateDateColumn()
    created: Date;
}

export class AdviceContentLang {
    lang: string;
    content: AdviceContent;
}

export class AdviceContent {
    title: string;
    body: string;
    urlLabel: string;
}
