import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, UserProfileDto } from './dto/AuthDto.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetCurrentUserId } from './common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './common/decorators/get-current-user.decorator';
import { Public } from './common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GitHubService } from './github.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private githubService: GitHubService,
  ) {}

  @Public()
  @Post('signup')
  async signupLocal(@Body() payload: AuthDto) {
    return this.authService.signupLocal(payload);
  }

  @Get('github/login')
  githubLogin(@Res() res: Response) {
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const redirectUri = 'http://localhost:8080/api/auth/github/callback';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user:email',
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params}`;

    res.redirect(githubAuthUrl);
  }

  @Public()
  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const { tokens } = await this.githubService.handleGithubCallback(code);
      res.redirect(
        `${this.configService.get('CLIENT_URL')}/auth/callback?` +
          `access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
      );
    } catch {
      res.redirect(`${this.configService.get('CLIENT_URL')}/`);
    }
  }

  @Public()
  @Post('signin')
  async signinLocal(@Body() payload: AuthDto) {
    return await this.authService.signinLocal(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetCurrentUser() user: { userId: string }) {
    return await this.authService.getCurrentUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id/profile')
  async updateProfile(@Param('id') id: string, @Body() dto: UserProfileDto) {
    return this.authService.updateUserProfile(dto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  refreshToken(@Body() payload: { rt: string; userId: string }) {
    const { rt, userId } = payload;
    return this.authService.refreshTokens(userId, rt);
  }
}
