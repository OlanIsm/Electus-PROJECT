import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so other services can call this
  app.enableCors();

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🧠 AI Service running on: http://localhost:${port}`);
}
bootstrap();
