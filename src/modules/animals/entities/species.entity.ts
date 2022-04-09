/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Race } from './race.entity';
import { SpeciesCategory } from '../enum/species.category';

@Entity('species')
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column()
    category: SpeciesCategory;

    @OneToMany(() => Race, (race) => race.species)
    races: Race[];
}
