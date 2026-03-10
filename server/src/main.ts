import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS for Mobile & Web integration
  app.enableCors({
    origin: '*', // Allow all origins for local development/React Native testing
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`Suiver Backend running on: http://localhost:${port}`);
}
bootstrap();
