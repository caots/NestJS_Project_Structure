import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import VerificationTokenPayload from 'src/application/core/interface/verificationTokenPayload.interface';
import { EmailConfirmationService } from 'src/application/core/ultils/emailConfirmation.service';
import { SendEmailConfirmEvent } from 'src/domain/events/users/send-mail-confirm-email';

@EventsHandler(SendEmailConfirmEvent)
export class SendEmailConfirmHandler implements IEventHandler<SendEmailConfirmEvent> {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService
  ) { }

  async handle(event: SendEmailConfirmEvent) {
    const payload: VerificationTokenPayload = { email: event.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;
    const subject = "";
    await this.emailConfirmationService.sendVerificationLink(event.email, subject, text);
  }
}
