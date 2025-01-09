import { Body, Controller, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserOut } from '@spin-cycle-mono/shared';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../user.service';

@Controller('/settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUserSettings(@Req() req: Request): Promise<any> {
    const requester = req['user'];
    const user = await this.userService.findById(requester.sub);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      discogsId: user.discogsId,
      username: user.discogsUsername,
      email: user.email,
    };
  }

  @Patch('/:id')
  async updateSettings(@Param('id') id: string, @Body() params: { email: string }): Promise<UserOut> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    user.email = params.email;
    return UserOut.fromUser(await this.userService.update(user));
  }
}
