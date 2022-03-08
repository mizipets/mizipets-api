import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from './animal.entity';

@Entity('species')
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @OneToMany(() => Animal, (animal) => animal.species)
    animals: Animal[];
}
