import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { UserOut } from '@spin-cycle-mono/shared';
import { Request } from 'express';
import { Session } from 'express-session';

import { OauthService } from './oauth.service';

const COOKIE_NAME = 'spinCycleDiscogsOauthSecret';

@Controller('/auth')
export class AuthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('/')
  @Redirect()
  async getOAuthRedirect(@Req() req: Request): Promise<{ url: string }> {
    const [oauthRedirect, oauthSecret] = await this.oauthService.getRequestToken();
    req.session[COOKIE_NAME] = oauthSecret;
    await this.saveSession(req.session);

    return { url: oauthRedirect };
  }

  @Get('/callback')
  @Redirect(process.env.POST_AUTH_REDIRECT)
  async getAccessToken(@Req() req: Request): Promise<{ url: string }> {
    const [secret, token, verifier]: [string, string, string] = [
      req.session[COOKIE_NAME],
      req.query['oauth_token'] as string,
      req.query['oauth_verifier'] as string,
    ];

    const data: { user: UserOut; token: string } = await this.oauthService.saveTokenAndSecret(secret, token, verifier);
    return { url: `${process.env.POST_AUTH_REDIRECT}?token=${data.token}` };
  }

  private saveSession(session: Session): Promise<void> {
    return new Promise((resolve) => {
      session.save(resolve);
    });
  }
}
