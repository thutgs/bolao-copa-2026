import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO (evita injeção de dados)
    forbidNonWhitelisted: true, // Bloqueia a requisição se vierem campos extras
  }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
