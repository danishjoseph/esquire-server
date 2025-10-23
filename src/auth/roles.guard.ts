import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    const userRoles = user['cognito:groups'] || []; // Cognito stores roles here
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return true;
  }
}
