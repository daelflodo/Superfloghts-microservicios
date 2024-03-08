import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async create(createUserDto: CreateUserDto): Promise<IUser> {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const newUser = await this.userRepository.save(createUserDto);
    return newUser;
  }

  async findAll(): Promise<IUser[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<IUser> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    updateUserDto.password = await this.hashPassword(updateUserDto.password);
    return await this.userRepository.update(id, updateUserDto);
    //*hacer un console.log de update result
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return { status: HttpStatus.OK, msg: 'Delete' };
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async checkPassword(password: string, passwordDb: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDb);
  }
}
