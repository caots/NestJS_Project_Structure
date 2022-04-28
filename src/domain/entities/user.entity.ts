import { Entity, Column } from 'typeorm';
import { SendEmailConfirmEvent } from '../events/users/send-mail-confirm-email';
import { BaseEntity } from './base.entity';

@Entity('users')
export class Users extends BaseEntity {
  @Column()
  created_at: Date;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  password_salt: string;

  @Column()
  last_ip: string;

  @Column()
  last_logged: Date;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column()
  avatar: string;

  @Column()
  role_id: number;

  senEmailConfirm(
    email: string,
  ) {
    this.username = email;
    this.domainEvents.push(
      new SendEmailConfirmEvent('Send email confirm', this.username),
    );
  }
}
