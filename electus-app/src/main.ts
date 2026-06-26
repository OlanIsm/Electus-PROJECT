import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Serve static files from the uploads directory
  const express = require('express');
  const path = require('path');
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Enable CORS so the React frontend can talk to this API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  });

  const config = new DocumentBuilder()
    .setTitle('Electus ATS API')
    .setDescription('The Electus Applicant Tracking System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Electus API running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger Docs running on: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
