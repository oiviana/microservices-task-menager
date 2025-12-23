import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogMessageDto } from './dto/create-audit-log-message.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async create(payload: CreateAuditLogMessageDto): Promise<AuditLog> {
    const audit = this.auditRepo.create(payload);
    return this.auditRepo.save(audit);
  }

  async findByEntity(entity: 'task' | 'comment', entityId: string): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { entity, entityId },
      order: { createdAt: 'ASC' },
    });
  }
}
