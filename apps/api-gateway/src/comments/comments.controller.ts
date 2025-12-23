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
import { CreateCommentMessageDto } from './dto/create-comment-message.dto';
import { UpdateCommentMessageDto } from './dto/update-comment-message.dto';


@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(
    @Inject('COMMENTS_SERVICE') private readonly commentsClient: ClientProxy,
  ) {}

  @Get()
  findAll(
    @Param('taskId') taskId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number = 10
  ) {
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
    return this.commentsClient.send('comment.remove', { 
      id,
      taskId,
    });
  }
}