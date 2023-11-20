import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // ! ===== DEFINE CLASS VALIDATION PIPELINE =====
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    // ! ===== DEFINE SWAGGER AUTO DOCS BUILDER =====
    const config = new DocumentBuilder()
        .setTitle('Auto Essay Scoring API')
        .setDescription('The essay scoring API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    // ! ===== DEFINE PORT =====
    await app.listen(3001);
}
bootstrap();
