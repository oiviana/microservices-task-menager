import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CreateCommentMessageDto } from './dto/create-comment-message.dto';
import { FindCommentsMessageDto } from './dto/find-comments-message.dto';
import { FindOneCommentMessageDto } from './dto/find-one-comment-message.dto';
import { UpdateCommentMessageDto } from './dto/update-comment-message.dto';
import { RemoveCommentMessageDto } from './dto/remove-comment-message.dto';
import { CustomLogger } from '@repo/logger';

@Controller()
export class CommentsController {
  private readonly context = CommentsController.name;

  constructor(
    private readonly commentsService: CommentsService,
    private readonly logger: CustomLogger,
  ) { }

  @MessagePattern('comment.create')
  create(@Payload() payload: CreateCommentMessageDto) {
    this.logger.log(`Evento recebido: comment.create`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.commentsService.create(payload);
  }

  @MessagePattern('comment.findAll')
  findAll(@Payload() payload: FindCommentsMessageDto) {
    const page = payload.page ?? 1;
    const size = payload.size ?? 10;

    this.logger.log(`Evento recebido: comment.findAll`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.commentsService.findAll(payload.taskId, page, size);
  }

  @MessagePattern('comment.findOne')
  findOne(@Payload() payload: FindOneCommentMessageDto) {
    this.logger.log(`Evento recebido: comment.findOne`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.commentsService.findOne(payload.id);
  }

  @MessagePattern('comment.update')
  update(@Payload() payload: UpdateCommentMessageDto) {
    this.logger.log(`Evento recebido: comment.update`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.commentsService.update(payload.id, payload.body);
  }

  @MessagePattern('comment.remove')
  remove(@Payload() payload: RemoveCommentMessageDto) {
    this.logger.log(`Evento recebido: comment.remove`, this.context);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`, this.context);

    return this.commentsService.remove(payload.id);
  }
}
