import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',  { unique: true })
    email: string;

    @Column('text')
    password: string;

    // @Column()
    // firstname: string;
    //
    // @Column()
    // lastname: string;
    //
    // @Column()
    // photoUrl: string;
    //
    @Column()
    createDate: Date;
    //
    @Column('date')
    closeDate: Date;
}
