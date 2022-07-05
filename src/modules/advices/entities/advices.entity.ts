/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-25
 */
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    type: AdviceType;

    @ApiProperty()
    @Column('text')
    imageUrl: string;

    @ApiProperty({ type: () => Specie })
    @ManyToOne(() => Specie, (specie) => specie.advices)
    specie: Specie;

    @ApiProperty()
    @Column('text')
    url: string;

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        nullable: false
    })
    langContent: AdviceContentLang[];

    @ApiProperty()
    @CreateDateColumn()
    created: Date;
}

export class AdviceContent {
    @ApiProperty()
    title: string;
    @ApiProperty()
    body: string;
    @ApiProperty()
    urlLabel: string;
}
export class AdviceContentLang {
    @ApiProperty()
    lang: string;
    @ApiProperty()
    content: AdviceContent;
}
