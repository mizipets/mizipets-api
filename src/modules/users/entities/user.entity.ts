/**
 * @author Julien DA CORTE & Latif SAGNA & Maxime D'HARBOULLE
 * @create 2022-03-11
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { Roles } from '../../authentication/enum/roles.emum';
import { Favorites } from '../../favorites/entities/favorites.entity';
import { Room } from '../../room/entities/room.entity';

export class Address {
    readonly city: string;
    readonly country: string;
    readonly roadName: string;
    readonly roadNumber: string;
}

export class Preferences {
    lang: string;
    darkMode: boolean;
    notifications: boolean;
    update: boolean;
}

export class Shelter {
    name: string;
}

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

    @Column('json')
    address: Address;

    @Column('json')
    preferences: Preferences;

    @Column('json', { nullable: true })
    shelter: Shelter;

    @Column()
    role: Roles;

    @Column()
    createDate: Date;

    @Column({ nullable: true })
    closeDate: Date;

    @OneToMany(() => Animal, (animal) => animal.owner)
    animals: Animal[];

    @OneToMany(() => Favorites, (favorite) => favorite.user)
    favorites: Favorites[];

    @OneToMany(() => Room, (animal) => animal.adoptant)
    rooms: Room[];
}
