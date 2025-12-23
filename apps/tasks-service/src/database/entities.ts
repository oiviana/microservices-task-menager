import { Task } from "../tasks/entities/task.entity";
import { Comment } from "../comments/entities/comment.entity";
import { AuditLog } from "../audit-logs/entities/audit-log.entity";

export const entities = [Task, Comment, AuditLog];