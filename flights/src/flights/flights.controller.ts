import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FlightMSG, RabbitMQ } from 'src/common/constanst';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @MessagePattern(FlightMSG.CREATE)
  create(@Payload() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @MessagePattern(FlightMSG.FIND_ALL)
  findAll() {
    return this.flightsService.findAll();
  }

  @MessagePattern(FlightMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.flightsService.findOne(id);
  }

  @MessagePattern(FlightMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.flightsService.update(payload.id, payload.updateFlightDto);
  }

  @MessagePattern(FlightMSG.DELETE)
  remove(@Payload() id: string) {
    return this.flightsService.remove(id);
  }

  @MessagePattern(FlightMSG.ADD_PASSANGER)
   addPassanger(@Payload() payload:any) {    
    return this.flightsService.addPassenger(
      payload.flightId,
      payload.passengerId,
    );
  }
  
}
