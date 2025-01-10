import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { FolderOut } from '@spin-cycle-mono/shared';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../users/user.service';
import { DiscogsService } from './discogs.service';

@Controller('/discogs')
@UseGuards(AuthGuard)
export class DiscogsController {
  constructor(
    private readonly discogsService: DiscogsService,
    private readonly userService: UserService,
  ) {}

  @Get('/folders')
  async getCollections(@Req() req: Request): Promise<FolderOut[]> {
    const user = await this.userService.findById(req['user']?.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.discogsService.getFolders(user);
  }
}
