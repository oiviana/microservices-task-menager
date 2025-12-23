import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import type { AuditChanges } from '../types/audit-change.type';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entity: 'task' | 'comment';

  @Column()
  entityId: string;

  @Column()
  action: 'create' | 'update' | 'delete';

  @Column('jsonb')
  changes: AuditChanges

  @Column()
  actorId: string;

  @CreateDateColumn()
  createdAt: Date;
}
