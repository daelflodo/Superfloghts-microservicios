import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const usernameFound = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    const emailFound = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (usernameFound)
      throw new ConflictException('The username already exists');
    if (emailFound) throw new ConflictException('The email already exists');
    const newUser = await this.userRepository.save(createUserDto);
    delete newUser.password;
    return newUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userRepository.find();
    users.map((user) => delete user.password);
    return users;
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    if (!updateUserDto.password) throw new BadRequestException('Missing data');
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');
    updateUserDto.password = await this.hashPassword(updateUserDto.password);
    await this.userRepository.update(id, updateUserDto);
    user = await this.userRepository.findOne({ where: { id } });
    delete user.password;
    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');
    await this.userRepository.delete(id);
    delete user.password
    return {
      message: 'User deleted successfully',
      statusCode: HttpStatus.OK,
      user,
    };
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async checkPassword(password: string, passwordDb: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDb);
  }
}
