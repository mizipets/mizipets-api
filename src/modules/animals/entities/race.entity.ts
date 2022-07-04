/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from './animal.entity';
import { NameLang, Specie } from './specie.entity';

@Entity('races')
export class Race {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'jsonb',
        array: false,
        nullable: false
    })
    names: NameLang[];

    @ManyToOne(() => Specie, (specie) => specie.races)
    specie: Specie;

    @OneToMany(() => Animal, (animal) => animal.race)
    animals: Animal[];
}
