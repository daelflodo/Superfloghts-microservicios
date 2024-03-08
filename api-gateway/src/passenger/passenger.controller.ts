import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { PassengerMSG } from 'src/common/constanst';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiTags('passengers')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/passenger')
export class PassengerController {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
  ) {}
  private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

  @Post()
  create(
    @Body() createPassengerDto: CreatePassengerDto,
  ): Observable<IPassenger> {
    return this._clientProxyPassenger.send(
      PassengerMSG.CREATE,
      createPassengerDto,
    );
  }

  @Get()
  findAll(): Observable<IPassenger[]> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.UPDATE, {
      updatePassengerDto,
      id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._clientProxyPassenger.send(PassengerMSG.DELETE, id);
  }
}
