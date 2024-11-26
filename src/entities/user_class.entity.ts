import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Class } from "./class.entity";
import { User } from "./user.entity";

@Entity({name: 'users_classes'})
export class UserClass extends AbstractEntity<UserClass> {
    @Column()
    time: Date;

    @ManyToOne(
        () => User, 
        (user) => user.userClass,
        { eager: true }
    )
    user: UserClass;

    @ManyToOne(
        () => Class, 
        (class_) => class_.class,
        { eager: true }
    )
    class: UserClass;
}
