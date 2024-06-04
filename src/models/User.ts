import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class User {
    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string; 

    @Column()
    mobile!: string;

    constructor(name: string, email: string, password: string, mobile: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile; // Initialize the mobile property
    }
}