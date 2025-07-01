// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // --- START OF CRITICAL DEBUGGING CODE ---
  console.log('--- CRITICAL DEBUG INFO ---');
  console.log(`[DEBUG] DATABASE_URL from process.env: ${process.env.DATABASE_URL}`);
  console.log(`[DEBUG] PORT from process.env: ${process.env.PORT}`);
  console.log('--- END OF CRITICAL DEBUG INFO ---');
  // --- END OF CRITICAL DEBUGGING CODE ---

  const app = await NestFactory.create(AppModule); // Uses the correct import names

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // The original listen command is correct
  await app.listen(process.env.PORT ?? 4002); 
}
bootstrap();