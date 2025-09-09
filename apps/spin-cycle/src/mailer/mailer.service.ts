import { Injectable, Logger } from '@nestjs/common';
import { SpinEntity, UserEntity } from '@spin-cycle-mono/shared';
import Mailgun, { MessagesSendResult } from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import * as process from 'node:process';

@Injectable()
export class MailerService {
  private readonly logger: Logger = new Logger(MailerService.name);

  sendRecommendationMail(spin: SpinEntity, user: UserEntity): Promise<MessagesSendResult> {
    return this.sendMail([user.email], this.getRecommendationSubject(), this.getRecommendationBody(spin));
  }

  sendAdminSignupMail(user: UserEntity): Promise<MessagesSendResult> {
    return this.sendMail(
      ['spincycle@lrdiv.co'],
      '🚨 New Spin Cycle Signup',
      `<p>Discogs user ${user.discogsUsername} just signed up! 🙌</p>`,
    );
  }

  private sendMail(to: string[], subject: string, body: string): Promise<MessagesSendResult> {
    const fromEmail = process.env.MAILGUN_EMAIL ?? 'spincycle@lrdiv.co';
    const mailgunDomain = fromEmail.includes('@') ? fromEmail.split('@')[1] : 'lrdiv.co';
    return this.getClient().messages.create(mailgunDomain, {
      to,
      subject,
      from: `SpinCycle <${fromEmail}>`,
      html: body,
    });
  }

  private getRecommendationSubject(): string {
    const today: Date = new Date();
    const month: string = today.toLocaleString('default', { month: 'long' });
    const day: number = today.getDate();
    return `Your ${month} ${day} record-mendation from SpinCycle has arrived! 😤`;
  }

  private getRecommendationBody(spin: SpinEntity): string {
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
