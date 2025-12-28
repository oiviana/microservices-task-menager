import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('PinoLogger')
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info('Criando novo usuário');

    const { name, email, password } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.info('Usuário criado com sucesso');

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.debug('Buscando todos os usuários');
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    this.logger.debug('Buscando usuário por id');
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug('Buscando usuário por email');
    return this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.info('Atualizando usuário');

    await this.userRepository.update(id, updateUserDto);

    const user = await this.findOne(id);
    if (!user) {
      this.logger.error('Usuário não encontrado após update');
      throw new Error('User not found');
    }

    this.logger.info('Usuário atualizado com sucesso');

    return user;
  }

  async remove(id: string): Promise<void> {
    this.logger.info('Removendo usuário');
    await this.userRepository.delete(id);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    this.logger.debug('Atualizando refresh token do usuário');
    await this.userRepository.update(userId, { refreshToken });
  }

  async clearRefreshToken(userId: string) {
    this.logger.debug('Limpando refresh token do usuário');
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
