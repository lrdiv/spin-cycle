import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Page, ReleaseOut, SpinEntity, SpinOut, UserEntity } from '@spin-cycle-mono/shared';
import { Request } from 'express';
import { DeepPartial } from 'typeorm';

import { AuthGuard } from '../auth/auth.guard';
import { DiscogsService } from '../discogs/discogs.service';
import { UserService } from '../users/user.service';
import { SpinsService } from './spins.service';

@Controller('/spins')
@UseGuards(AuthGuard)
export class SpinsController {
  constructor(
    private readonly discogsService: DiscogsService,
    private readonly spinsService: SpinsService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getUserSpins(@Req() req: Request, @Query('page', ParseIntPipe) page: number): Promise<Page<SpinOut>> {
    return this.spinsService.getPageForUser(req['user'].sub, page).catch((e) => this.handleUnauthorized(e));
  }

  @Patch('/:id')
  async updateSpin(@Param('id') id: number, @Req() req: Request, @Body() body: DeepPartial<SpinOut>): Promise<SpinOut> {
    const spin: SpinEntity | null = await this.spinsService.findById(id);
    this.validateSpinAndUser(spin, req['user'].sub);

    return this.spinsService.update(spin, body);
  }

  @Get('/random')
  async getRandomRelease(@Req() req: Request): Promise<SpinOut> {
    const userId: string = req['user'].sub;
    const user: UserEntity = await this.userService.findByIdWithSpins(userId).catch((e) => this.handleUnauthorized(e));

    const nextSpin: ReleaseOut | null = await this.discogsService.getRandomRecord(user);

    if (nextSpin) {
      const { discogsId, artistName, recordName } = nextSpin;
      const releaseSpin: SpinEntity = new SpinEntity(null, user, discogsId, artistName, recordName, new Date());
      const savedSpin: SpinEntity = await this.spinsService.create(releaseSpin);
      return SpinOut.fromSpin(savedSpin);
    }

    await this.userService.update(user, { allPlayed: true });
    return null;
  }

  private handleUnauthorized(e: unknown): null {
    Logger.error(e);
    throw new UnauthorizedException();
  }

  private validateSpinAndUser(spin: SpinEntity, userId: string): void {
    if (spin.user.id !== userId) {
      throw new UnauthorizedException();
    }
    if (!spin) {
      throw new NotFoundException();
    }
  }
}
