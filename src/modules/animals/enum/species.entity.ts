import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpeciesCategory } from './species-category.enum';
import { Animal } from '../animal.entity';

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
}
