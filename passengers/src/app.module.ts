import { Module } from '@nestjs/common';
import * as joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerModule } from './passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        PORT: joi.number().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_DATABASE: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', 
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        // migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    PassengerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
