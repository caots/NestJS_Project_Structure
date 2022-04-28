import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private configService: ConfigService,
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {
    this.nodemailerTransport = createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: configService.get('MAIL_USERNAME'),
        pass: configService.get('MAIL_PASSWORD')
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

  public async sendVerificationLink(email: string, token: string) {
    const subject = "Confirm Email";
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    const info = await this.sendMail({
      from: this.configService.get('MAIL_FROM_ADDRESS'),
      to: email,
      subject,
      text,
    })

    console.log("send email: %s", info)
    return info
  }

  public async confirmEmail(email: string) {
    const user = await this.usersRepository.getByUserName(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.markEmailAsConfirmed(email);
  }
}
