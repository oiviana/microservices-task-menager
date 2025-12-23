import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  // CREATE
  async create(payload: {
    taskId: string;
    authorId: string;
    body: string;
  }): Promise<Comment> {
    const comment = this.commentRepo.create(payload);
    return this.commentRepo.save(comment);
  }

  // FIND ALL paginação
  async findAll(
    taskId: string,
    page = 1,
    size = 10,
  ): Promise<{ data: Comment[]; meta: { page: number; size: number; total: number; totalPages: number } }> {
    const [data, total] = await this.commentRepo.findAndCount({
      where: { taskId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment with id ${id} not found`);
    return comment;
  }

  // UPDATE
  async update(id: string, body?: string): Promise<Comment> {
    const comment = await this.findOne(id);
    if (body !== undefined) comment.body = body;
    return this.commentRepo.save(comment);
  }

  // REMOVE
  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepo.remove(comment);
  }
}
