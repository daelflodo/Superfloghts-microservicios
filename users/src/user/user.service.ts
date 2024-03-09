import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
    try {
      createUserDto.password = await this.hashPassword(createUserDto.password);
      const usernameFound = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
      const emailFound = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (usernameFound || emailFound)
        throw new ConflictException('key duplicada');
      const newUser = await this.userRepository.save(createUserDto);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<IUser[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<IUser> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    updateUserDto.password = await this.hashPassword(updateUserDto.password);
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return { status: HttpStatus.OK, msg: 'Usuario Eliminado Correctamente' };
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
