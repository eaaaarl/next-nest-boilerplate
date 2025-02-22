import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/AuthDto.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetCurrentUserId } from './common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './common/decorators/get-current-user.decorator';
import { Public } from './common/decorators/public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signupLocal(@Body() payload: AuthDto) {
    return this.authService.signupLocal(payload);
  }

  @Public()
  @Post('signin')
  async signinLocal(@Body() payload: AuthDto) {
    return this.authService.signinLocal(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetCurrentUser() user: any) {
    return { user };
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
