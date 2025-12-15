import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
