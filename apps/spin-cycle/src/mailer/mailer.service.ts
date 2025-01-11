import { Injectable, Logger } from '@nestjs/common';
import { SpinEntity, UserEntity } from '@spin-cycle-mono/shared';
import Mailgun, { MessagesSendResult } from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import * as process from 'node:process';

@Injectable()
export class MailerService {
  private readonly logger: Logger = new Logger(MailerService.name);

  async sendMail(spin: SpinEntity, user: UserEntity): Promise<MessagesSendResult> {
    return this.getClient().messages.create('lrdiv.co', {
      from: `SpinCycle <spincycle@lrdiv.co>`,
      to: [user.email],
      subject: this.getSubject(),
      html: this.getBody(spin),
    });
  }

  private getSubject(): string {
    const today: Date = new Date();
    const month: string = today.toLocaleString('default', { month: 'long' });
    const day: number = today.getDate();
    return `Your ${month} ${day} record-mendation from SpinCycle has arrived! 😤`;
  }

  private getBody(spin: SpinEntity): string {
    return `
      <p>Hello there!</p>
      <p>Today's randomly selected record from your collection is:</p>
      <p><strong>${spin.recordName}</strong> by <strong>${spin.artistName}</strong></p>
      <p><a href="https://discogs.com/release/${spin.discogsId}">View record on Discogs</a></p>
      <p>Happy spinning!</p>
    `;
  }

  private getClient(): IMailgunClient {
    return new Mailgun(FormData).client({
      username: 'api',
      key: process.env.MAILGUN_KEY,
    });
  }
}
