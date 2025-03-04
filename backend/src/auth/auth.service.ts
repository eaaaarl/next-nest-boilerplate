import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './types/jwt-payload.type';
import * as argon from 'argon2';
import { AuthDto, SignUpAuthDto, UserProfileDto } from './dto/AuthDto.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Token } from './types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signupLocal(dto: SignUpAuthDto): Promise<any> {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user
      .create({
        data: {
          username: dto.username,
          name: dto.name,
          email: dto.email,
          password: hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.setToken(user.id, user.username);
    await this.updateRtToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user || !user.password)
      return new ForbiddenException('User not found');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException({
        status: 401,
        message: 'Invalid username or password',
        error: 'Unauthorized',
      });
    }

    const tokens = await this.setToken(user.id, user.username);
    await this.updateRtToken(user.id, tokens.refresh_token);
    return { tokens, user };
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        rtToken: {
          not: null,
        },
      },
      data: {
        rtToken: null,
      },
    });
    return true;
  }

  async getCurrentUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        avatar: true,
        createdAt: true,
        email: true,
        name: true,
        username: true,
        providerId: true,
      },
    });
  }

  async updateUserProfile(dto: UserProfileDto, id: string) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
      },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.rtToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.rtToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.setToken(user.id, user.username);
    await this.updateRtToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtToken(userId: string, rt: string): Promise<void> {
    const hashRt = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        rtToken: hashRt,
      },
    });
  }

  async setToken(
    userId: string,
    username: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      username: username,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '30s',
      }),
      this.jwt.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: '5m',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
