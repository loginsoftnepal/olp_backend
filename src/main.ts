import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import 'dotenv/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketwayAdapter } from './socketway/sockerway.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  const adapter = new SocketwayAdapter(app);
  // app.useWebSocketAdapter(adapter);
  app.useStaticAssets(join(__dirname, '../uploadedFiles'));
  app.useGlobalPipes(new ValidationPipe());
  // app.setGlobalPrefix('v1/api');
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('OlpApi Documetation')
    // .addCookieAuth('accessToken')
    .setDescription('A full fledged OLP_API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
    },
  });
  const port = process.env.PORT || 8000;
  await app.listen(port).then(() => {
    logger.log('listening on port: ' + port);
  });
}
bootstrap();
