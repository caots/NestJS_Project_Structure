import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
 
@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
 
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      }
    });
  }
 
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update({ username: email }, {
      isEmailConfirmed: true
    });
  }

  public sendVerificationLink(email: string, subject: string, text: string) {
    return this.sendMail({
      to: email,
      subject,
      text,
    })
  }
}
