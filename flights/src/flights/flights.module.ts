import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Flight, Passenger])
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
