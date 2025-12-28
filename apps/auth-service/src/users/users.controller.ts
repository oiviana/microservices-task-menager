import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserMessageDto } from '@/users/dto/update-user-message.dto';
import { CustomLogger } from '@/logger/custom-logger';

@Controller()
export class UsersController {
  private readonly context = UsersController.name;

  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLogger,
  ) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    this.logger.log(
      `Evento recebido: createUser`,
      this.context,
    );

    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    this.logger.log(
      `Evento recebido: findAllUsers`,
      this.context,
    );

    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() payload: { id: string }) {
    this.logger.log(
      `Evento recebido: findOneUser`,
      this.context,
    );

    return this.usersService.findOne(payload.id);
  }

  @MessagePattern('updateUser')
  update(@Payload() payload: UpdateUserMessageDto) {
    this.logger.log(
      `Evento recebido: updateUser`,
      this.context,
    );

    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern('removeUser')
  remove(@Payload() payload: { id: string }) {
    this.logger.log(
      `Evento recebido: removeUser`,
      this.context,
    );

    return this.usersService.remove(payload.id);
  }
}
