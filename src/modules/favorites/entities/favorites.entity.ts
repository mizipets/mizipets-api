/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceType } from '../../services/enums/service-type.enum';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
export class Favorites {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('json')
    reference: Reference;

    @ApiProperty()
    @Column()
    type: ServiceType;

    @ApiProperty({ type: () => [User] })
    @ManyToOne(() => User, (user) => user.favorites)
    user: User;
}

export type Reference = AdoptionReferences | AdviceReferences | VetsReferences;

export class AdoptionReferences {
    @ApiProperty()
    disliked: number[];
    @ApiProperty()
    liked: number[];
}

export class AdviceReferences {
    @ApiProperty()
    liked: number[];
}

export class VetsReferences {
    @ApiProperty()
    id?: number;
}
