import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:app.get(ConfigService).getOrThrow('UI_URL'),
    credential:true
  })
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
