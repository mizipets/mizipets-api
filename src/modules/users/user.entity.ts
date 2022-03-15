import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { Roles } from '../authentication/enum/roles.emum';
import { Favorites } from '../favorites/favorites.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    firstname: string;

    @Column('text')
    lastname: string;

    @Column({ nullable: true })
    photoUrl: string;

    @Column()
    role: Roles;

    @Column()
    createDate: Date;

    @Column({ nullable: true })
    closeDate: Date;

    @OneToMany(() => Animal, (animal) => animal.owner)
    animals: Animal[];

    @OneToMany(() => Favorites, (favorite) => favorite.user)
    favorites: Favorites;
}
