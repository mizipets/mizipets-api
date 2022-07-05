/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Race } from './race.entity';
import { SpecieCategory } from '../enum/specie.category';
import { Advice } from '../../advices/entities/advices.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('species')
export class Specie {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    name: string;

    @ApiProperty()
    @Column()
    category: SpecieCategory;

    @ApiProperty()
    @OneToMany(() => Race, (race) => race.specie)
    races: Race[];

    @ApiProperty()
    @OneToMany(() => Advice, (advice) => advice.specie)
    advices: Advice[];
}
