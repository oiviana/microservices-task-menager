import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskStatus } from '../types/task-status.enum';
import { TaskPriority } from '../types/task-priority.enum';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column()
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  assigneeId?: string;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
