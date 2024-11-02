import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification extends AbstractEntity<Notification> {
  @Column()
  type: string;

  // Many - to - One
  @Column()
  senderId: number;

  // Many - to - One
  @Column()
  receiverId: number;

  @Column()
  content: number;

  @Column()
  options: string;
}
