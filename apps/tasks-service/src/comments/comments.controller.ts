import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CreateCommentMessageDto } from './dto/create-comment-message.dto';
import { FindCommentsMessageDto } from './dto/find-comments-message.dto';
import { FindOneCommentMessageDto } from './dto/find-one-comment-message.dto';
import { UpdateCommentMessageDto } from './dto/update-comment-message.dto';
import { RemoveCommentMessageDto } from './dto/remove-comment-message.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern('comment.create')
  create(@Payload() payload: CreateCommentMessageDto) {
    return this.commentsService.create(payload);
  }

  @MessagePattern('comment.findAll')
  findAll(@Payload() payload: FindCommentsMessageDto) {
    const page = payload.page ?? 1;
    const size = payload.size ?? 10;
    return this.commentsService.findAll(payload.taskId, page, size);
  }

  @MessagePattern('comment.findOne')
  findOne(@Payload() payload: FindOneCommentMessageDto) {
    return this.commentsService.findOne(payload.id);
  }

  @MessagePattern('comment.update')
  update(@Payload() payload: UpdateCommentMessageDto) {
    return this.commentsService.update(payload.id, payload.body);
  }

  @MessagePattern('comment.remove')
  remove(@Payload() payload: RemoveCommentMessageDto) {
    return this.commentsService.remove(payload.id);
  }
}
