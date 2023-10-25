import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LOCAL_STRATEGY } from '@src/constant';
import { AuthenticationService } from '@src/auth/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validate a user.
   *
   * @param username
   * @param password
   */
  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authenticationService.validateUser({
        email: username.toLowerCase(),
        password,
        strategy: LOCAL_STRATEGY,
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      return false;
    }
  }
}
