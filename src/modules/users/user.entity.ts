import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../authentication/enum/roles.emum';

@Entity()
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
}
