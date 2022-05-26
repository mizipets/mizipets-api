/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceType } from '../../services/enums/service-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    reference: Reference;

    @Column()
    type: ServiceType;

    @ManyToOne(() => User, (user) => user.favorites)
    user: User;
}

export type Reference =
    | AdoptionReferences
    | AdviceReferences
    | VetsReferences;

export class AdoptionReferences {
    disliked: number[];
    liked: number[];
}

export class AdviceReferences {
    id?: number;
}

export class VetsReferences {
    id?: number;
}
