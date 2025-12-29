import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Inject,
  Put,
  Delete,
  ParseIntPipe,
  DefaultValuePipe 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CustomLogger } from '@repo/logger';
import { CreateCommentMessageDto } from './dto/create-comment-message.dto';
import { UpdateCommentMessageDto } from './dto/update-comment-message.dto';


@Controller('tasks/:taskId/comments')
export class CommentsController {
  private readonly context = CommentsController.name;
  constructor(
    @Inject('COMMENTS_SERVICE') private readonly commentsClient: ClientProxy,
    private readonly logger: CustomLogger,
  ) {}

  @Get()
  findAll(
    @Param('taskId') taskId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number = 10
  ) {
    this.logger.log(`Evento recebido: comment.findAll`, this.context);
    return this.commentsClient.send('comment.findAll', { 
      taskId, 
      page, 
      size 
    });
  }

  @Get(':id')
  findOne(
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ) {
    this.logger.log(`Evento recebido: comment.findOne`, this.context);
    return this.commentsClient.send('comment.findOne', { 
      id,
      taskId 
    });
  }

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentMessageDto
  ) {
    this.logger.log(`Evento recebido: comment.create`, this.context);
    return this.commentsClient.send('comment.create', { 
      ...dto, 
      taskId 
    });
  }

  @Put(':id')
  update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateCommentMessageDto
  ) {
    this.logger.log(`Evento recebido: comment.update`, this.context);
    return this.commentsClient.send('comment.update', { 
      taskId,
      ...dto 
    });
  }

  @Delete(':id')
  remove(
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ) {
    this.logger.log(`Evento recebido: comment.remove`, this.context);
    return this.commentsClient.send('comment.remove', { 
      id,
      taskId,
    });
  }
}