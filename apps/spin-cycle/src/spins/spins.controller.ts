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
import { Page, SpinEntity, SpinOut } from '@spin-cycle-mono/shared';
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

  private handleUnauthorized(e: unknown): null {
    Logger.error(e);
    throw new UnauthorizedException();
  }

  private validateSpinAndUser(spin: SpinEntity, userId: string): void {
    if (!spin) {
      throw new NotFoundException();
    }

    if (spin.user.id !== userId) {
      throw new UnauthorizedException();
    }
  }
}
