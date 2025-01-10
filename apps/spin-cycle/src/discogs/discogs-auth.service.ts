import { Injectable } from '@nestjs/common';
import { UserEntity } from '@spin-cycle-mono/shared';
import OAuth from 'oauth-1.0a';

import { UserService } from '../users/user.service';

interface IDiscogsIdentity {
  id: number;
  username: string;
}

interface IOAuthConfig {
  urls: {
    accessToken: string;
    authorize: string;
    requestToken: string;
    callback: string;
    identity: string;
  };
  consumer: {
    key: string;
    secret: string;
  };
  signatureMethod: 'PLAINTEXT';
  version: '1.0';
}

@Injectable()
export class DiscogsAuthService {
  private readonly config: IOAuthConfig = {
    urls: {
      requestToken: 'https://api.discogs.com/oauth/request_token',
      accessToken: 'https://api.discogs.com/oauth/access_token',
      authorize: 'https://www.discogs.com/oauth/authorize',
      callback: process.env.OAUTH_CALLBACK_URL,
      identity: 'https://api.discogs.com/oauth/identity',
    },
    version: '1.0',
    signatureMethod: 'PLAINTEXT',
    consumer: {
      key: process.env.DISCOGS_KEY,
      secret: process.env.DISCOGS_SECRET,
    },
  };

  public readonly client: OAuth = new OAuth({
    consumer: this.config.consumer,
    signature_method: 'PLAINTEXT',
  });

  constructor(private readonly userService: UserService) {}

  async getRequestToken(): Promise<[string, string]> {
    const headers: OAuth.Header = this.client.toHeader(
      this.client.authorize(this.getRequestData('requestToken', 'GET')),
    );

    const params = new URLSearchParams(await this.makeRequest(this.config.urls.requestToken, 'GET', headers, true));
    const [token, secret]: [string, string] = [params.get('oauth_token'), params.get('oauth_token_secret')];

    const redirect = `${this.config.urls.authorize}?oauth_token=${token}`;
    return [redirect, secret];
  }

  async saveTokenAndSecret(secret: string, token: string, verifier: string): Promise<UserEntity> {
    const requestData = { ...this.getRequestData('accessToken', 'POST'), data: { oauth_verifier: verifier } };
    const headers: OAuth.Header = this.client.toHeader(this.client.authorize(requestData, { key: token, secret }));
    const params = new URLSearchParams(await this.makeRequest(this.config.urls.accessToken, 'POST', headers, true));
    const [oauthToken, oauthTokenSecret]: [string, string] = [
      params.get('oauth_token'),
      params.get('oauth_token_secret'),
    ];

    const discogsUser: IDiscogsIdentity = await this.getDiscogsUser(this.client, oauthToken, oauthTokenSecret);
    const existingUser: UserEntity | null = await this.userService.findByDiscogsId(discogsUser.id);
    return existingUser
      ? await this.updateUserAuthDetails(existingUser, discogsUser, oauthToken, oauthTokenSecret)
      : await this.createUserFromAuthDetails(discogsUser, oauthToken, oauthTokenSecret);
  }

  private async createUserFromAuthDetails(
    identity: IDiscogsIdentity,
    token: string,
    secret: string,
  ): Promise<UserEntity> {
    const user: UserEntity = new UserEntity(null, null, identity.username, identity.id, token, secret);
    return this.userService.create(user);
  }

  private async updateUserAuthDetails(
    user: UserEntity,
    identity: IDiscogsIdentity,
    token: string,
    secret: string,
  ): Promise<UserEntity> {
    user.discogsId = identity.id;
    user.discogsUsername = identity.username;
    user.discogsToken = token;
    user.discogsSecret = secret;
    return this.userService.update(user);
  }

  private async getDiscogsUser(client: OAuth, token: string, secret: string): Promise<IDiscogsIdentity> {
    const requestData = this.getRequestData('identity', 'GET');
    const headers: OAuth.Header = client.toHeader(client.authorize(requestData, { key: token, secret }));
    return this.makeRequest<IDiscogsIdentity>(this.config.urls.identity, 'GET', headers);
  }

  private async makeRequest<T>(url: string, method: 'GET' | 'POST', headers: OAuth.Header, text = false): Promise<T> {
    const resp = await fetch(url, {
      method,
      headers: {
        Authorization: headers.Authorization,
        'User-Agent': process.env.DISCOGS_USER_AGENT,
      },
    });

    if (!resp.ok) {
      return Promise.reject('Unable to make authentication request');
    }

    return text ? resp.text() : resp.json();
  }

  private getRequestData(url: keyof IOAuthConfig['urls'], method: 'GET' | 'POST', data?: any): OAuth.RequestOptions {
    data ||= { oauth_callback: this.config.urls.callback };
    return { url: this.config.urls[url], method, data };
  }
}
