import { AbstractEntity } from "../database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Program } from "./program.entity";

@Entity({ name: 'users_programs' })
export class UserProgram extends AbstractEntity<UserProgram> {
    @Column()
    time: Date;

    @ManyToOne(
        () => User, 
        (user) => user.UserProgram,
        { eager: true }
    )
    user: User;

    @ManyToOne(
        () => Program, 
        (program) => program.userProgram,
        { eager: true }
    )
    program: Program;    

}
