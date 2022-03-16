import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceType } from '../services/enums/service-type.enum';
import { User } from '../users/user.entity';

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    reference:
        | AdoptionReferences
        | AdviceReferences
        | PetsReferences
        | VetReferences;

    @Column()
    type: ServiceType;

    @ManyToOne(() => User, (user) => user.favorites)
    user: User;
}

export class AdoptionReferences {
    disliked: number[];
    liked: number[];
}

export class PetsReferences {
    id?: number;
}

export class AdviceReferences {
    id?: number;
}

export class VetReferences {
    id?: number;
}
