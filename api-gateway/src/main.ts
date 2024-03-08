import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());

  const options = new DocumentBuilder()
    .setTitle('SuperFligt API')
    .setDescription('App de Vuelos Programados')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  // Generar configuración de Swagger como JSON
  const swaggerJson = JSON.stringify(document, null, 2);

  // Escribir el JSON en un archivo
  fs.writeFileSync('swagger.json', swaggerJson);

  await app.listen(PORT, '0.0.0.0', () => {
    console.log('Listening in port:' + PORT);
  });
}
bootstrap();
