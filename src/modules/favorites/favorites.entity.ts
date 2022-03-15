import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    reference: AdoptionReferences | AdvicesReferences;

    @ManyToOne(() => User, (user) => user.favorites)
    user: User;
}

export class AdoptionReferences {
    disliked: number[];
    liked: number[];
}

export class AdvicesReferences {
    id: number;
}
