import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Species } from './species.entity';

@Entity('races')
export class Race {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToOne(() => Species, (specie) => specie.races)
    species: Species;
}
