import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogMessageDto } from './dto/create-audit-log-message.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,

    @Inject('PinoLogger')
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuditLogsService.name);
  }

  async create(payload: CreateAuditLogMessageDto): Promise<AuditLog> {
    this.logger.info('Criando novo audit log');
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const audit = this.auditRepo.create(payload);
    const saved = await this.auditRepo.save(audit);

    this.logger.info('Audit log criado com sucesso');
    return saved;
  }

  async findByEntity(entity: 'task' | 'comment', entityId: string): Promise<AuditLog[]> {
    this.logger.info(`Buscando audit logs para entidade ${entity} com ID ${entityId}`);

    const logs = await this.auditRepo.find({
      where: { entity, entityId },
      order: { createdAt: 'ASC' },
    });

    this.logger.info(`Encontrados ${logs.length} audit logs para ${entity} ${entityId}`);
    return logs;
  }
}
