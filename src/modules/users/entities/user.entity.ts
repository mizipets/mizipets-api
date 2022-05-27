/**
 * @author Julien DA CORTE & Latif SAGNA & Maxime D'HARBOULLE
 * @create 2022-03-11
 */
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { Roles } from '../../authentication/enum/roles.emum';
import { Favorites } from '../../favorites/entities/favorites.entity';
import { Room } from '../../room/entities/room.entity';
import { Device } from '../../device/entities/device.entity';

export class Address {
    street: string;
    apartment: string;
    zip: number;
    city: string;
    country: string;
}

export class Preferences {
    lang: string;
    darkMode: boolean;
    notifications: boolean;
    updates: boolean;
}

export class Shelter {
    name: string;
}

export class RefreshToken {
    refreshKey: string;
    expireAt: number;
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('text')
    firstname: string;

    @Column('text')
    lastname: string;

    @Column('text', { nullable: true })
    photo: string;

    @Column('text', { nullable: true })
    flutterToken: string;

    @Column({ nullable: true })
    code?: number;

    @Column('json', { nullable: true })
    refreshToken?: RefreshToken;

    @Column('json')
    address: Address;

    @Column('json')
    preferences: Preferences;

    @Column('json', { nullable: true })
    shelter: Shelter;

    @Column()
    role: Roles;

    @CreateDateColumn()
    createDate: Date;

    @Column({ nullable: true })
    closeDate?: Date;

    @OneToMany(() => Animal, (animal) => animal.owner)
    animals: Animal[];

    @OneToMany(() => Animal, (animal) => animal.lastOwner)
    pastAnimals: Animal[];

    @OneToMany(() => Favorites, (favorite) => favorite.user)
    favorites: Favorites[];

    @OneToMany(() => Room, (animal) => animal.adoptant)
    rooms: Room[];

    @Column({ type: 'json', nullable: true })
    notifications: Notification[];

    @OneToMany(() => Device, (device) => device.user)
    devices: Device[];
}
