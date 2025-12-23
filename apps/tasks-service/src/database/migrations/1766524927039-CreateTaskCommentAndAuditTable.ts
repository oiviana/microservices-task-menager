import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskCommentAndAuditTable1766524927039 implements MigrationInterface {
    name = 'CreateTaskCommentAndAuditTable1766524927039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "authorId" uuid NOT NULL, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "dueDate" TIMESTAMP, "priority" "public"."tasks_priority_enum" NOT NULL, "status" "public"."tasks_status_enum" NOT NULL, "createdBy" character varying NOT NULL, "assigneeId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entity" character varying NOT NULL, "entityId" character varying NOT NULL, "action" character varying NOT NULL, "message" text NOT NULL, "actorId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD CONSTRAINT "FK_ba265816ca1d93f51083e06c520" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_ba265816ca1d93f51083e06c520"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "task_comments"`);
    }

}
