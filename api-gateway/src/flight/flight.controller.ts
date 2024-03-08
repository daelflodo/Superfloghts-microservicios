import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { CreateFlightDto } from './dto/create-flight.dto';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { FlightMSG, PassengerMSG } from 'src/common/constanst';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiTags('flights')
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/flight')
export class FlightController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyFlight = this.clientProxy.clientProxyFlights();
  private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

  @Post()
  create(@Body() createFlightDto: CreateFlightDto): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.CREATE, createFlightDto);
  }

  @Get()
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ONE, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlightDto: UpdateFlightDto,
  ): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.UPDATE, {
      updateFlightDto,
      id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._clientProxyFlight.send(FlightMSG.DELETE, id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this._clientProxyPassenger
      .send(PassengerMSG.FIND_ONE, passengerId)
      .toPromise();
    if (!passenger)
      throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);
    return this._clientProxyFlight.send(FlightMSG.ADD_PASSANGER, {
      flightId,
      passengerId,
    });
  }

  //* una forma diferente sin usar metodo deprecado
  /**
   * import { from } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

// Dentro de tu clase...

@Post(':flightId/passenger/:passengerId')
async addPassenger(
  @Param('flightId') flightId: string,
  @Param('passengerId') passengerId: string,
) {
  const passenger = await this._clientProxyPassenger
    .send(PassengerMSG.FIND_ONE, passengerId)
    .pipe(
      map(response => {
        if (!response) {
          throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);
        }
        return response;
      }),
      first(), // Para obtener solo el primer valor y completar el Observable
      catchError(error => {
        throw new HttpException('Error retrieving passenger', HttpStatus.INTERNAL_SERVER_ERROR);
      })
    )
    .toPromise();

  return this._clientProxyFlight.send(FlightMSG.ADD_PASSANGER, {
    flightId,
    passengerId,
  }).toPromise();
}

   */
}
