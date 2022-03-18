import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from './animal.entity';
import { Species } from './species.entity';

@Entity('races')
export class Race {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToOne(() => Species, (specie) => specie.races)
    species: Species;

    @OneToMany(() => Animal, (animal) => animal.race)
    animals: Animal[];
}
