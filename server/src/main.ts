import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag('api')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(3000);
}
bootstrap();
