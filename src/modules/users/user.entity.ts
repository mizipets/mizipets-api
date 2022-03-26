import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { Roles } from '../authentication/enum/roles.emum';
import { Favorites } from '../favorites/favorites.entity';
import { Room } from '../room/room.entity';

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

    @Column('json')
    address: {
        city: string;
        country: string;
        roadName: string;
        roadNumber: string;
    };

    @Column({ nullable: true })
    photoUrl: string;

    @Column('json')
    preferences: {
        lang: string;
        darkMode: boolean;
        notifications: boolean;
        update: boolean;
    };

    @Column()
    role: Roles;

    @Column('json', { nullable: true })
    shelter: {
        name: string;
    };

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
