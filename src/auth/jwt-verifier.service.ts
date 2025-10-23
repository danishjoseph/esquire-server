import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { UserRole } from 'user/enums/user-role.enum';
import { UserService } from 'user/user.service';

@Injectable()
export class JwtVerifierService {
  private readonly logger = new Logger(JwtVerifierService.name);
  private verifier: ReturnType<typeof CognitoJwtVerifier.create>;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID')!,
      clientId: this.configService.get<string>('COGNITO_CLIENT_ID')!,
      tokenUse: 'access', // or 'access'
    });
  }

  assignUserRole(payload: { 'cognito:groups'?: string[] }): UserRole {
    const groups = payload['cognito:groups'] || [];
    const roleFromGroup = (Object.values(UserRole) as string[]).find((role) =>
      groups.includes(role),
    );

    // Return the found role or default to UserRole.FOE
    return (roleFromGroup as UserRole) || UserRole.FOE;
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.verifier.verify(token);
      const userInput = {
        sub: payload.sub,
        role: this.assignUserRole(payload),
        email: (payload.email as string) ?? null,
      };
      const user = await this.userService.ensureUser(userInput, userInput.sub);
      return user;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
