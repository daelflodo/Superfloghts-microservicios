import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new AllExceptionFilter());
  // app.useGlobalInterceptors(new TimeOutInterceptor());
  // app.useGlobalPipes(new ValidationPipe());
  
  const options = new DocumentBuilder()
  .setTitle('SuperFligt API')
  .setDescription('App de Vuelos Programados')
  .setVersion('2.0.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('/api/docs', app, document,{
    swaggerOptions:{
      filter: true,
    }
  });
   // Generar configuración de Swagger como JSON
   const swaggerJson = JSON.stringify(document, null, 2);

   // Escribir el JSON en un archivo
   fs.writeFileSync('swagger.json', swaggerJson);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
