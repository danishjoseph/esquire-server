import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class JwtVerifierService {
  private readonly logger = new Logger(JwtVerifierService.name);
  private verifier: ReturnType<typeof CognitoJwtVerifier.create>;

  constructor(private readonly configService: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID')!,
      clientId: this.configService.get<string>('COGNITO_CLIENT_ID')!,
      tokenUse: 'id', // or 'access'
    });
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.verifier.verify(token);
      return payload;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
