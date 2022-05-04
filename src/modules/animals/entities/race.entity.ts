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
import { Specie } from './specie.entity';

@Entity('races')
export class Race {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToOne(() => Specie, (specie) => specie.races)
    specie: Specie;

    @OneToMany(() => Animal, (animal) => animal.race)
    animals: Animal[];
}
