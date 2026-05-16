import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  // Enable CORS so other services can call this
  app.enableCors();

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`📄 Document Service running on: http://localhost:${port}`);
}
bootstrap();
