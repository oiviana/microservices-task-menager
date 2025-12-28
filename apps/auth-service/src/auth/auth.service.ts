import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @Inject('PinoLogger')
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async register(data: { name: string; email: string; password: string }) {
    this.logger.info('Iniciando registro de usuário');

    const user = await this.usersService.create(data);

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    this.logger.info('Usuário registrado com sucesso');

    return {
      user,
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    this.logger.info('Tentativa de login');

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn('Login falhou: usuário não encontrado');
      throw new UnauthorizedException();
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      this.logger.warn('Login falhou: senha inválida');
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    this.logger.info('Login realizado com sucesso');

    return {
      user,
      ...tokens,
    };
  }

  generateTokens(userId: string, email: string) {
    this.logger.debug('Gerando tokens para usuário');

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

  async refreshTokens(userId: string, email: string, refreshToken: string) {
    this.logger.info('Iniciando refresh de tokens');

    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      this.logger.warn('Refresh falhou: usuário inválido ou sem refresh token');
      throw new UnauthorizedException();
    }

    const refreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenValid) {
      this.logger.warn('Refresh falhou: refresh token inválido');
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(userId, email);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(userId, hashedRefresh);

    this.logger.info('Refresh de tokens realizado com sucesso');

    return tokens;
  }

  async logout(userId: string) {
    if (!userId) {
      this.logger.error('Logout falhou: userId não informado');
      throw new RpcException('UserId não informado no logout');
    }

    await this.usersService.clearRefreshToken(userId);

    this.logger.info('Logout realizado com sucesso');

    return { message: 'Logged out successfully' };
  }
}
