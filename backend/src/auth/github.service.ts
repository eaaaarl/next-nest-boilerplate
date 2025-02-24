// github.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

interface GitHubUser {
  id: number;
  login: string;
  email: string;
  name: string;
  avatar_url: string;
  bio?: string;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

@Injectable()
export class GitHubService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getGithubToken(code: string): Promise<GitHubTokenResponse> {
    const params = new URLSearchParams({
      client_id:
        this.configService.get('GITHUB_CLIENT_ID') ?? 'Ov23li8TDub4qtuIGDaD',
      client_secret:
        this.configService.get('GITHUB_CLIENT_SECRET') ??
        '9e83d4f84c169315d89ff4dffb59f17d5930b982',
      code,
    });

    const response = await fetch(
      `https://github.com/login/oauth/access_token?${params}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedException('Failed to get GitHub token');
    }

    return response.json();
  }

  async getGithubUser(access_token: string): Promise<GitHubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to get GitHub user');
    }

    return response.json();
  }

  async handleGithubCallback(code: string) {
    const { access_token } = await this.getGithubToken(code);

    const githubUser = await this.getGithubUser(access_token);
    let user = await this.prisma.user.findFirst({
      where: {
        providerId: githubUser.id.toString(),
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: githubUser.login,
          email: githubUser.email,
          providerId: githubUser.id.toString(),
          avatar: githubUser.avatar_url,
          name: githubUser.name,
        },
      });
    }

    const tokens = await this.authService.setToken(user.id, user.username);
    await this.authService.updateRtToken(user.id, tokens.refresh_token);

    return {
      user,
      tokens,
    };
  }
}
