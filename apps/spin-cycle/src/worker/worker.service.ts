import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReleaseOut, SpinEntity, UserEntity } from '@spin-cycle-mono/shared';

import { DiscogsService } from '../discogs/discogs.service';
import { SpinsService } from '../spins/spins.service';
import { UserService } from '../users/user.service';
import { sleep } from '../util/util';

const CRON_EXPRESSION: string = '0 9 * * *'; // 9AM every day

@Injectable()
export class WorkerService {
  private readonly logger: Logger = new Logger(WorkerService.name);

  constructor(
    private readonly discogsService: DiscogsService,
    private readonly spinsService: SpinsService,
    private readonly userService: UserService,
  ) {}

  @Cron(CRON_EXPRESSION)
  async sendSpins(): Promise<void> {
    const users: UserEntity[] = await this.userService.findAllWithUnplayed();
    for (const user of users) {
      try {
        await this.sendSpin(user);
      } catch (e: unknown) {
        this.handleSpinError(e, user);
      }
      await sleep(5);
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
    await this.spinsService.create(releaseSpin);
  }

  private handleSpinError(e: unknown, user: UserEntity) {
    this.logger.error(`Error encountered on user with ID: ${user.id}`);
    this.logger.error(e);
  }

  private async markUserAsAllPlayed(user: UserEntity): Promise<void> {
    await this.userService.update(user, { allPlayed: true });
  }
}
