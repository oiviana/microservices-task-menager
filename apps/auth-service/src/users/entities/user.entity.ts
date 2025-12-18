import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  /**
   * Identificador único do usuário
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
 * Nome do usuário
 */
  @Column({ type: 'varchar', length: 255 })
  name: string;


  /**
   * Email do usuário
   * - único
   * - indexado
   * - obrigatório
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  /**
   * Senha do usuário (hash)
   */
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  /**
   * Data de criação do registro
   * Preenchida automaticamente pelo TypeORM
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /**
   * Data da última atualização do registro
   * Atualizada automaticamente pelo TypeORM
   */

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}