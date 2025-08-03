import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 60 * 1000,
        },
      }),
    );

    app.enableCors({
      origin: ['http://localhost:5174', 'https://deploy-macetas.vercel.app/', process.env.FRONTEND_URL || '*'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    console.log(`🚀 Application is running on port ${port}`);
  } catch (error) {
    console.error('Error starting application:', error);
    setTimeout(() => process.exit(1), 10000);
  }
}
bootstrap();