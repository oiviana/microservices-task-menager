import { JwtAuthGuard } from "@/guards/jwt-auth.guard";
import { JwtRefreshGuard } from "@/guards/jwt-refresh.guard";
import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { CustomLogger } from '@repo/logger';

@Controller('auth')
export class AuthController {
  private readonly context = AuthController.name;

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly logger: CustomLogger,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    this.logger.log(`Evento recebido: auth.register`, this.context);
    return this.authClient.send('auth.register', dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    this.logger.log(`Evento recebido: auth.login`, this.context);
    return this.authClient.send('auth.login', dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req, @Body() body) {
    this.logger.log(`Evento recebido: auth.refresh`, this.context);
    return this.authClient.send('auth.refresh', {
      userId: req.user.id,
      email: req.user.email,
      refreshToken: body.refreshToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    this.logger.log(`Evento recebido: auth.logout`, this.context);
    return this.authClient.send('auth.logout', {
      userId: req.user.userId,
    });
  }
}
