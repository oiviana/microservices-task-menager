import { JwtAuthGuard } from "@/guards/jwt-auth.guard";
import { JwtRefreshGuard } from "@/guards/jwt-refresh.guard";
import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authClient.send('auth.register', dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authClient.send('auth.login', dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req, @Body() body) {
    return this.authClient.send('auth.refresh', {
      userId: req.user.id,
      email: req.user.email,
      refreshToken: body.refreshToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.authClient.send('auth.logout', {
      userId: req.user.userId,
    });
  }
}
