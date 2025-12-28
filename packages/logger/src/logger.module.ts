import { Global, Module, Provider } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PinoLogger } from 'nestjs-pino';
import { CustomLogger } from './custom-logger';

const pinoLoggerProvider: Provider = {
  provide: 'PinoLogger',
  useClass: PinoLogger,
};

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
      },
    }),
  ],
  providers: [pinoLoggerProvider, CustomLogger],
  exports: [LoggerModule, 'PinoLogger', CustomLogger],
})
export class AppLoggerModule {}
