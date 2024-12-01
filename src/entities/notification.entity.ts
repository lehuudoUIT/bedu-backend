import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'notifications' })
export class Notification extends AbstractEntity<Notification> {
  @Column()
  type: string;

  @Column()
  content: string;

  @Column({ default: '' })
  options: string;

  @ManyToOne(
    () => User, 
    (receiver) => receiver.notificationReceiver,
    { eager: true }
  )
  receiver: User;

  @ManyToOne(
    () => User,
    (sender) => sender.notificationSender,
    { eager: true }
  )
  sender: User;
}
