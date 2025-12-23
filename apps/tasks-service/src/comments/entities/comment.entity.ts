import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity('task_comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @ManyToOne(() => Task, task => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column('uuid')
  authorId: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;
}
