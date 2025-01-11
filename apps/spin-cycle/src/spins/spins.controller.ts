import { Controller, Get, Logger, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ReleaseOut, SpinEntity, SpinOut, UserEntity } from '@spin-cycle-mono/shared';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { DiscogsService } from '../discogs/discogs.service';
import { UserService } from '../users/user.service';
import { AllReleasesSpunException } from './spins.exception';
import { SpinsService } from './spins.service';

@Controller('/spins')
@UseGuards(AuthGuard)
export class SpinsController {
  constructor(
    private readonly discogsService: DiscogsService,
    private readonly spinsService: SpinsService,
    private readonly userService: UserService,
  ) {}

  @Get('/random')
  async getRandomRelease(@Req() req: Request): Promise<SpinOut> {
    const user: UserEntity = await this.userService
      .findByIdWithSpins(req['user'].sub)
      .catch((e) => this.handleUnauthorized(e));

    const nextSpin: ReleaseOut | null = await this.discogsService
      .getRandomRecord(user)
      .catch((e) => this.handleAllRecordsPlayed(e));

    if (!nextSpin) {
      return null;
    }

    const { discogsId, artistName, recordName } = nextSpin;
    const releaseSpin: SpinEntity = new SpinEntity(null, user, discogsId, artistName, recordName, new Date());
    const savedSpin: SpinEntity = await this.spinsService.create(releaseSpin);
    return SpinOut.fromSpin(savedSpin);
  }

  private handleAllRecordsPlayed(e: unknown): null {
    if (e instanceof AllReleasesSpunException) {
      Logger.error(e);
      return null;
    }
    throw e;
  }

  private handleUnauthorized(e: unknown): null {
    Logger.error(e);
    throw new UnauthorizedException();
  }
}
