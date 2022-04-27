import { BaseEvent } from 'src/domain/events/base-event';

export class SendEmailConfirmEvent extends BaseEvent {
  constructor(
    public readonly eventName: string,
    public readonly email: string,
  ) {
    super(eventName);
  }
}
