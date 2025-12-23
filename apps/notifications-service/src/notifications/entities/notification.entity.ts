import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { NotificationType } from '../types/notification.enum';

@Entity('notifications')
export class Notification {
    /**
     * Identificador único da notificação
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * ID do usuário destinatário da notificação
     * - indexado para melhor performance
     * - obrigatório
     */
    @Index()
    @Column({ name: 'user_id', type: 'uuid', nullable: false })
    userId: string;

    /**
     * Mensagem da notificação
     * - obrigatória
     */
    @Column({ type: 'varchar', length: 500, nullable: false })
    message: string;

    /**
     * ID da tarefa relacionada (opcional)
     */
    @Column({ name: 'task_id', type: 'uuid', nullable: true })
    taskId?: string;

    /**
     * Tipo da notificação
     * - obrigatório
     * - valores específicos: ASSIGNED, STATUS_CHANGED, COMMENT
     */
    @Column({
        type: 'enum',
        enum: NotificationType,
        nullable: false,
    })
    type: NotificationType;

    /**
     * Data de criação da notificação
     * Preenchida automaticamente pelo TypeORM
     */
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}