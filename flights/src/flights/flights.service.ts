import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { IFlight } from 'src/common/interfaces/flight.interface';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  async create(createFlightDto: CreateFlightDto): Promise<IFlight> {
    const flight = await this.flightRepository.findOne({
      where: { pilot: createFlightDto.pilot },
    });

    if (flight) throw new ConflictException('The pilot already exists');
    return await this.flightRepository.save(createFlightDto);
  }

  async findAll(): Promise<IFlight[]> {
    return await this.flightRepository.find({ relations: ['passengers'] });
  }

  async findOne(id: string): Promise<IFlight> {
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) throw new NotFoundException('Flight not found');
    return flight;
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<IFlight> {
    if (
      updateFlightDto.airplane &&
      updateFlightDto.destinationCity &&
      updateFlightDto.flightDate &&
      updateFlightDto.pilot
    )
      throw new BadRequestException('Missing data');

    let flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) throw new NotFoundException('Passenger Not Found');
    await this.flightRepository.update(id, updateFlightDto);
    flight = await this.flightRepository.findOne({ where: { id } });
    return flight;
  }

  async remove(id: string) {
    const flight = await this.flightRepository.findOne({ where: { id } });
    if (!flight) throw new NotFoundException('Passenger Not Found');
    await this.flightRepository.delete(id);
    return {
      message: 'Passenger deleted successfully',
      statusCode: HttpStatus.OK,
      flight,
    };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<any> {
    if(!flightId || passengerId) throw new BadRequestException('Missing data')
    const flight = await this.flightRepository.findOne({
      where: { id: flightId }
    });
    const passenger = await this.passengerRepository.findOne({
      where: { id: passengerId },
    });
    if(!flight && !passenger) throw new NotFoundException('The flight or the passenger does not exist')
    passenger.flight = flight;
    await this.passengerRepository.save(passenger);
    return await this.flightRepository.find({ relations: ['passengers'] });
  }
}
