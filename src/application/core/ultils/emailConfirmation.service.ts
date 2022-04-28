import { Injectable } from '@nestjs/common';

import EmailService from './email.service';

 
@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailService: EmailService,
  ) {}
 
  public sendVerificationLink(email: string, subject: string, text: string) {
    return this.emailService.sendMail({
      to: email,
      subject,
      text,
    })
  }
}