import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserMessageDto } from '@/users/dto/update-user-message.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() payload: { id: string }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern('updateUser')
  update(@Payload() payload: UpdateUserMessageDto) {
    return this.usersService.update(payload.id, payload.data);
  }

  @MessagePattern('removeUser')
  remove(@Payload() payload: { id: string }) {
    return this.usersService.remove(payload.id);
  }
}
