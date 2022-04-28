import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/application/core/auth/auth.config';
import VerificationTokenPayload from 'src/application/core/interface/verificationTokenPayload.interface';
import { EmailService } from 'src/application/core/ultils/email.service';
import { SendEmailConfirmEvent } from 'src/domain/events/users/send-mail-confirm-email';

@EventsHandler(SendEmailConfirmEvent)
export class SendEmailConfirmHandler implements IEventHandler<SendEmailConfirmEvent> {

  constructor(
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }

  async handle(event: SendEmailConfirmEvent) {
    const payload: VerificationTokenPayload = { email: event.email };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresInConfirmEmail
    });
    await this.emailService.sendVerificationLink(event.email, token);
  }
}
