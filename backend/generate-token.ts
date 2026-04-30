import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const jwtService = app.get(JwtService);
  
  const payload = { sub: 1, email: 'teste@teste.com' };
  const token = jwtService.sign(payload);
  
  console.log('--- GERADO TOKEN MANUAL ---');
  console.log(token);
  
  await app.close();
}
bootstrap();
