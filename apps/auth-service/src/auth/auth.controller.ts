import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { JwtRefreshGuard } from '@/guards/jwt-refresh.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req) {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.email);
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  logout(@Req() req) {
    const user = req.user;
    return this.authService.logout(user.sub);
  }

}
