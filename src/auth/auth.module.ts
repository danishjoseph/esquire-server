import { Module } from '@nestjs/common';
import { JwtVerifierService } from './jwt-verifier.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JwtVerifierService, AuthGuard, RolesGuard],
  exports: [JwtVerifierService, AuthGuard, RolesGuard],
})
export class AuthModule {}
