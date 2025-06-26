import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend access (adjust origin as needed)
  app.enableCors({
    origin: true, // or specify e.g., ['https://your-frontend-url.com']
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4002);
}
bootstrap();
