import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@src/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@src/modules/user/user.module';

import { AuthenticationController } from './controllers';
import { AuthenticationService } from './services';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: String(configService.get('jwt.secret')),
          signOptions: {
            expiresIn: String(configService.get('jwt.expiresIn')),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, LocalStrategy],
  exports: [AuthenticationService],
})
export class AuthModule {}
