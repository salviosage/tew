import { PassportStrategy } from '@nestjs/passport';
import { ModuleRef } from '@nestjs/core';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import configuration from '@src/config/configuration';
import { JWT_STRATEGY } from '@src/constant';
import { AuthenticationService } from '@src/auth/services';

/**
 * JWT auth strategy.
 *
 * A default value is provided for the jwt secret in case it is not available.
 * @todo use injected config
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private authenticationService: AuthenticationService;

  constructor(private readonly moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration().jwt.secret,
      ignoreExpiration: false,
    });
  }

  onModuleInit(): void {
    this.authenticationService = this.moduleRef.get(AuthenticationService, {
      strict: false,
    });
  }

  /**
   * Check if JWT Token is valid
   */
  async validate(payload: any): Promise<any> {
    const user = await this.authenticationService.validateUser({
      id: payload.id,
      strategy: JWT_STRATEGY,
    });

    return user || payload;
  }
}
