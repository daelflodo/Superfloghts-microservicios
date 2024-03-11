import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from './entities/passenger.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPassenger } from 'src/common/interfaces/passenger.interface';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}
  async create(createPassengerDto: CreatePassengerDto): Promise<IPassenger> {
    const passenger = await this.passengerRepository.findOne({
      where: { email: createPassengerDto.email },
    });

    if (passenger) throw new ConflictException('The email already exists');
    return await this.passengerRepository.save(createPassengerDto);
  }

  async findAll(): Promise<IPassenger[]> {
    return await this.passengerRepository.find();
  }

  async findOne(id: string): Promise<IPassenger> {
    const passenger = await this.passengerRepository.findOne({ where: { id } });
    if (!passenger) throw new NotFoundException('Passenger not found');
    return passenger;
  }

  async update(id: string, updatePassengerDto: UpdatePassengerDto) {
    if (!updatePassengerDto.email && !updatePassengerDto.name)
      throw new BadRequestException('Missing data');
    let passenger = await this.passengerRepository.findOne({ where: { id } });
    if (!passenger) throw new NotFoundException('Passenger Not Found');
    await this.passengerRepository.update(id, updatePassengerDto);
    passenger = await this.passengerRepository.findOne({ where: { id } });
    return passenger;
  }

  async remove(id: string) {
    const passenger = await this.passengerRepository.findOne({ where: { id } });
    if (!passenger) throw new NotFoundException('Passenger Not Found');
    await this.passengerRepository.delete(id);
    return {
      message: 'Passenger deleted successfully',
      statusCode: HttpStatus.OK,
      passenger,
    };
  }
}
