/**
 * @author Julien DA CORTE & Latif SAGNA & Maxime D'HARBOULLE
 * @create 2022-03-11
 */
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { Roles } from '../../authentication/enum/roles.emum';
import { Favorites } from '../../favorites/entities/favorites.entity';
import { Room } from '../../room/entities/room.entity';
import { Device } from '../../device/entities/device.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Address {
    @ApiProperty()
    street: string;
    @ApiProperty()
    apartment: string;
    @ApiProperty()
    zip: number;
    @ApiProperty()
    city: string;
    @ApiProperty()
    country: string;
}

export class Preferences {
    @ApiProperty()
    lang: string;
    @ApiProperty()
    darkMode: boolean;
    @ApiProperty()
    notifications: boolean;
    @ApiProperty()
    updates: boolean;
}

export class Shelter {
    @ApiProperty()
    name: string;
}

export class RefreshToken {
    @ApiProperty()
    refreshKey: string;
    @ApiProperty()
    expireAt: number;
}

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text', { unique: true })
    email: string;

    @ApiProperty()
    @Column('text', { select: false })
    password: string;

    @ApiProperty()
    @Column('text')
    firstname: string;

    @ApiProperty()
    @Column('text')
    lastname: string;

    @ApiProperty()
    @Column('text', { nullable: true })
    photo: string;

    @ApiProperty()
    @Column('text', { nullable: true })
    flutterToken: string;

    @ApiProperty()
    @Column({ nullable: true })
    code?: number;

    @ApiProperty()
    @Column('json', { nullable: true })
    refreshToken?: RefreshToken;

    @ApiProperty()
    @Column('json')
    address: Address;

    @ApiProperty()
    @Column('json')
    preferences: Preferences;

    @ApiProperty()
    @Column('json', { nullable: true })
    shelter: Shelter;

    @ApiProperty()
    @Column()
    role: Roles;

    @ApiProperty()
    @CreateDateColumn()
    createDate: Date;

    @ApiProperty()
    @Column({ nullable: true })
    closeDate?: Date;

    @ApiProperty({ type: () => [Animal] })
    @OneToMany(() => Animal, (animal) => animal.owner)
    animals: Animal[];

    @ApiProperty({ type: () => [Animal] })
    @OneToMany(() => Animal, (animal) => animal.lastOwner)
    pastAnimals: Animal[];

    @ApiProperty({ type: () => [Favorites] })
    @OneToMany(() => Favorites, (favorite) => favorite.user)
    favorites: Favorites[];

    @ApiProperty({ type: () => [Room] })
    @OneToMany(() => Room, (animal) => animal.adoptant)
    rooms: Room[];

    @ApiProperty({ type: () => [Notification] })
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @ApiProperty({ type: () => [Device] })
    @OneToMany(() => Device, (device) => device.user)
    devices: Device[];

    removeSensitiveData(): void {
        if (this.role === Roles.STANDARD) {
            delete this.address;
            delete this.shelter;
        }
        delete this.lastname;
        delete this.preferences;
        delete this.flutterToken;
        delete this.refreshToken;
        delete this.code;
        delete this.createDate;
        delete this.closeDate;
    }
}
