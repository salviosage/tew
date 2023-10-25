import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '@src/modules/user/entity/user.entity';
import { ENUM_ROLE_TYPE } from '@src/modules/user/interfaces';
import * as _ from 'lodash';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<ENUM_ROLE_TYPE[]>(
      'roles',
      context.getHandler(),
    );
    if (!allowedRoles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const { roles } = request.user as UserEntity;
    for (let i = 0; i < roles.length; i++) {
      if (allowedRoles.includes(roles[i])) {
        return true;
      }
    }
    return false;
  }
}
