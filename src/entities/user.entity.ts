import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column()
  sex: string;

  @Column()
  birthday: string;

  @Column()
  address: string;

  @Column({ unique: true })
  cid: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  currentLevel: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
