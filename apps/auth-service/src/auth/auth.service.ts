import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(data: { name: string; email: string; password: string }) {
    const user = await this.usersService.create(data);
    const tokens = this.generateTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);
    return {
      user,
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user.id, user.email);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return {
      user,
      ...tokens,
    };
  }

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: string,
    email: string,
    refreshToken: string,
  ) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const refreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenValid) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(userId, email);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefresh);

    return tokens;
  }

  async logout(userId: string) {
    if (!userId) {
      throw new RpcException('UserId não informado no logout');
    }

    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

}
