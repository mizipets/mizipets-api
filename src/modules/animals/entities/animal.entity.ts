import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Sex } from '../enum/sex.enum';
import { Race } from './race.entity';
import { Species } from './species.entity';

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    comment: string;

    @ManyToOne(() => Race, (race) => race.animals)
    race: Race;

    @Column({ nullable: true })
    sex: Sex;

    @Column({ nullable: true })
    isFavorites: boolean;

    @Column({ nullable: true })
    isLost: boolean;

    @Column({ nullable: true })
    birthDate: Date;

    @Column()
    createDate: Date;

    @Column('json')
    images: string[];

    @ManyToOne(() => User, (user) => user.animals)
    owner: User;
}