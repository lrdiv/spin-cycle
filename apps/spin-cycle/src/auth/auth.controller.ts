import { Controller, Get, Logger, Redirect, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@spin-cycle-mono/shared';
import { Request } from 'express';
import { Session } from 'express-session';

import { DiscogsAuthService } from '../discogs/discogs-auth.service';

const COOKIE_NAME = 'spinCycleDiscogsOauthSecret';

@Controller('/auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly oauthService: DiscogsAuthService,
  ) {}

  @Get('/')
  @Redirect()
  async getOAuthRedirect(@Req() req: Request): Promise<{ url: string }> {
    const [oauthRedirect, oauthSecret] = await this.oauthService.getRequestToken();
    req.session[COOKIE_NAME] = oauthSecret;
    await this.saveSession(req.session);

    return { url: oauthRedirect };
  }

  @Get('/callback')
  @Redirect()
  async getAccessToken(@Req() req: Request): Promise<{ url: string }> {
    const [secret, token, verifier]: [string, string, string] = [
      req.session[COOKIE_NAME],
      req.query['oauth_token'] as string,
      req.query['oauth_verifier'] as string,
    ];

    const user: UserEntity = await this.oauthService.saveTokenAndSecret(secret, token, verifier);
    const jwt: string = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: 100 * 24 * 60 });
    return { url: `${process.env.POST_AUTH_REDIRECT}?token=${jwt}` };
  }

  private saveSession(session: Session): Promise<void> {
    return new Promise((resolve) => {
      session.save(resolve);
    });
  }
}
