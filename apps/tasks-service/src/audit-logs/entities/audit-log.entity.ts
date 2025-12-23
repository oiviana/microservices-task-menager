import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column('text')
  message: string;

  @Column()
  actorId: string;

  @CreateDateColumn()
  createdAt: Date;
}
