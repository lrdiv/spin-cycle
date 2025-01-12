import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserEntity, UserOut } from '@spin-cycle-mono/shared';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../users/user.service';

@Controller('/api/settings')
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
    if (req['user'].sub !== id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const updated: UserEntity = await this.userService.update(user, params);
    if (!updated) {
      throw new BadRequestException();
    }

    return UserOut.fromUser(updated);
  }
}
