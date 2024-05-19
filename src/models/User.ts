import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;
}