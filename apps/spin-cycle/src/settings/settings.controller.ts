import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserEntity, UserOut } from '@spin-cycle-mono/shared';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../users/user.service';

interface IUserParams {
  email?: string;
  folderId?: number;
  folderName?: string;
  pausedAt?: Date | null;
}

@Controller('/settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUserSettings(@Req() req: Request): Promise<UserOut> {
    const requester = req['user'];
    const user = await this.userService.findById(requester.sub);

    if (!user) {
      throw new NotFoundException();
    }

    return UserOut.fromUser(user);
  }

  @Patch('/:id')
  async updateSettings(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() params: { email: string; folderId: number; folderName: string },
  ): Promise<UserOut> {
    const user: UserEntity = await this.validateUser(req, id);
    return UserOut.fromUser(await this.updateUser(user, params));
  }

  @Post('/:id/pause')
  async togglePause(@Param('id') id: string, @Req() req: Request): Promise<UserOut> {
    const user: UserEntity = await this.validateUser(req, id);
    const pausedAt: Date | null = user.pausedAt ? null : new Date();

    return UserOut.fromUser(await this.updateUser(user, { pausedAt }));
  }

  private async validateUser(req: Request, id: string): Promise<UserEntity> {
    if (req['user'].sub !== id) {
      throw new UnauthorizedException();
    }
    const user: UserEntity = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async updateUser(user: UserEntity, params: IUserParams): Promise<UserEntity> {
    const updated: UserEntity = await this.userService.update(user, params);
    if (!updated) {
      throw new BadRequestException();
    }
    return updated;
  }
}
