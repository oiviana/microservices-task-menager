export type AuditChange<T = unknown> = {
  from: T | null;
  to: T | null;
};

export type AuditChanges = Record<string, AuditChange>;