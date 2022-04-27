import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailConfirmationService } from 'src/application/core/ultils/emailConfirmation.service';
import { SendEmailConfirmEvent } from 'src/domain/events/users/send-mail-confirm-email';

@EventsHandler(SendEmailConfirmEvent)
export class SendEmailConfirmHandler implements IEventHandler<SendEmailConfirmEvent> {
  
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) { }

  async handle(event: SendEmailConfirmEvent) {
    await this.emailConfirmationService.sendVerificationLink(event.email);
  }
}
