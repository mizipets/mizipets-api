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
import { ApiProperty } from '@nestjs/swagger';

@Entity('races')
export class Race {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    name: string;

    @ApiProperty()
    @ManyToOne(() => Specie, (specie) => specie.races)
    specie: Specie;

    @ApiProperty()
    @OneToMany(() => Animal, (animal) => animal.race)
    animals: Animal[];
}
