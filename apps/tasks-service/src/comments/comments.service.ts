import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @Inject('PinoLogger')
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CommentsService.name);
  }

  // CREATE
  async create(payload: {
    taskId: string;
    authorId: string;
    body: string;
  }): Promise<Comment> {
    this.logger.info('Criando novo comentário');
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const comment = this.commentRepo.create(payload);
    const saved = await this.commentRepo.save(comment);

    this.logger.info(`Comentário criado com ID: ${saved.id}`);
    return saved;
  }

  // FIND ALL paginação
  async findAll(
    taskId: string,
    page = 1,
    size = 10,
  ): Promise<{ data: Comment[]; meta: { page: number; size: number; total: number; totalPages: number } }> {
    this.logger.info(`Buscando comentários para taskId: ${taskId}, página: ${page}, tamanho: ${size}`);

    const [data, total] = await this.commentRepo.findAndCount({
      where: { taskId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });

    this.logger.info(`Encontrados ${data.length} comentários de um total de ${total}`);

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
    this.logger.info(`Buscando comentário com ID: ${id}`);

    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      this.logger.warn(`Comentário com ID ${id} não encontrado`);
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    return comment;
  }

  // UPDATE
  async update(id: string, body?: string): Promise<Comment> {
    this.logger.info(`Atualizando comentário com ID: ${id}`);
    this.logger.debug(`Novo body: ${body}`);

    const comment = await this.findOne(id);
    if (body !== undefined) comment.body = body;
    const updated = await this.commentRepo.save(comment);

    this.logger.info(`Comentário com ID ${id} atualizado`);
    return updated;
  }

  // REMOVE
  async remove(id: string): Promise<void> {
    this.logger.info(`Removendo comentário com ID: ${id}`);

    const comment = await this.findOne(id);
    await this.commentRepo.remove(comment);

    this.logger.info(`Comentário com ID ${id} removido`);
  }
}
