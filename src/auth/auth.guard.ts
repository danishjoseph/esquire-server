import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtVerifierService } from './jwt-verifier.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtVerifier: JwtVerifierService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.replace('Bearer ', '');
    const user = await this.jwtVerifier.verifyToken(token);

    if (!user) throw new UnauthorizedException('Invalid token');
    request.user = user; // attach to context
    return true;
  }
}
