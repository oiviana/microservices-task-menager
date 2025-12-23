import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('auth.register')
  register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern('auth.login')
  login(@Payload() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @MessagePattern('auth.refresh')
  refresh(
    @Payload()
    data: { userId: string; email: string; refreshToken: string },
  ) {
    return this.authService.refreshTokens(
      data.userId,
      data.email,
      data.refreshToken,
    );
  }

@MessagePattern('auth.logout')
async logout(@Payload('userId') userId: string) {
  return this.authService.logout(userId);
}

}
