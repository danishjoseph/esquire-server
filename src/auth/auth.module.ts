import { forwardRef, Module } from '@nestjs/common';
import { JwtVerifierService } from './jwt-verifier.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'user/user.module';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  providers: [JwtVerifierService, AuthGuard, RolesGuard],
  exports: [JwtVerifierService, AuthGuard, RolesGuard],
})
export class AuthModule {}
