import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { CustomLogger } from '@/logger/custom-logger';

@Controller()
export class AuthController {
  private readonly context = AuthController.name;

  constructor(
    private readonly authService: AuthService,
    private readonly logger: CustomLogger,
  ) {}

  @MessagePattern('auth.register')
  register(@Payload() dto: RegisterDto) {
    this.logger.log(
      `Evento recebido: auth.register`,
      this.context,
    );

    return this.authService.register(dto);
  }

  @MessagePattern('auth.login')
  login(@Payload() dto: LoginDto) {
    this.logger.log(
      `Evento recebido: auth.login`,
      this.context,
    );

    return this.authService.login(dto.email, dto.password);
  }

  @MessagePattern('auth.refresh')
  refresh(
    @Payload()
    data: { userId: string; email: string; refreshToken: string },
  ) {
    this.logger.log(
      `Evento recebido: auth.refresh`,
      this.context,
    );

    return this.authService.refreshTokens(
      data.userId,
      data.email,
      data.refreshToken,
    );
  }

  @MessagePattern('auth.logout')
  logout(@Payload('userId') userId: string) {
    this.logger.log(
      `Evento recebido: auth.logout`,
      this.context,
    );

    return this.authService.logout(userId);
  }
}
