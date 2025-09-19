import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReleaseOut, SpinEntity, UserEntity } from '@spin-cycle-mono/shared';

import { DiscogsService } from '../discogs/discogs.service';
import { MailerService } from '../mailer/mailer.service';
import { SpinsService } from '../spins/spins.service';
import { UserService } from '../users/user.service';
import { AM_CRON_EXPRESSION, sleep } from '../util/util';

@Injectable()
export class WorkerService {
  private readonly logger: Logger = new Logger(WorkerService.name);

  constructor(
    private readonly discogsService: DiscogsService,
    private readonly mailerService: MailerService,
    private readonly spinsService: SpinsService,
    private readonly userService: UserService,
  ) {}

  @Cron(AM_CRON_EXPRESSION)
  async sendSpins(): Promise<void> {
    const users: UserEntity[] = await this.userService.findAllWitUnplayedAndUnpaused();
    for (const user of users) {
      try {
        await this.sendSpin(user);
      } catch (e: unknown) {
        this.handleSpinError(e, user);
      }
      await sleep(3);
    }
  }

  private async sendSpin(user: UserEntity): Promise<void> {
    user.spins = await this.spinsService.findAllForUser(user);
    const nextSpin: ReleaseOut | null = await this.discogsService.getRandomRecord(user);

    if (!nextSpin) {
      return this.markUserAsAllPlayed(user);
    }

    const { discogsId, artistName, recordName } = nextSpin;
    const releaseSpin: SpinEntity = new SpinEntity(null, user, discogsId, artistName, recordName, new Date());
    await Promise.all([
      this.spinsService.create(releaseSpin),
      this.mailerService.sendRecommendationMail(releaseSpin, user),
    ]);
  }

  private handleSpinError(e: unknown, user: UserEntity) {
    this.logger.error(`Error encountered on user with ID: ${user.id}`);
    this.logger.error(e);
  }

  private async markUserAsAllPlayed(user: UserEntity): Promise<void> {
    await this.userService.update(user, { allPlayed: true });
  }
}
