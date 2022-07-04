/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Race } from './race.entity';
import { SpecieCategory } from '../enum/specie.category';
import { Advice } from '../../advices/entities/advices.entity';

@Entity('species')
export class Specie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'jsonb',
        array: false,
        nullable: false
    })
    names: NameLang[];

    @Column()
    category: SpecieCategory;

    @OneToMany(() => Race, (race) => race.specie)
    races: Race[];

    @OneToMany(() => Advice, (advice) => advice.specie)
    advices: Advice[];
}

export class NameLang {
    lang: string;
    name: string;
}
