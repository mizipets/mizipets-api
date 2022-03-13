import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from './animal.entity';
import { Race } from './race.entity';
import { SpeciesCategory } from './species-category.enum';

@Entity('species')
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column()
    category: SpeciesCategory;

    @OneToMany(() => Animal, (animal) => animal.species)
    animals: Animal[];

    @OneToMany(() => Race, (race) => race.species)
    races: Race[];
}
