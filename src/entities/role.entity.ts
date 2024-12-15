import { AbstractEntity } from "../database/abstract.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: 'roles'})
export class Role extends AbstractEntity<Role> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @OneToMany(() => User, (user) => user.role)
    user: User[];
}
