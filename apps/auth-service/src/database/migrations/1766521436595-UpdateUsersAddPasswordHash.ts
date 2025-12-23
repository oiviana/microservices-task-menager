import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersAddPasswordHash1766521436595 implements MigrationInterface {
    name = 'UpdateUsersAddPasswordHash1766521436595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5230070094e8135a3d763d90e7"`);
        await queryRunner.query(`CREATE INDEX "IDX_5230070094e8135a3d763d90e7" ON "users" ("refresh_token") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5230070094e8135a3d763d90e7"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5230070094e8135a3d763d90e7" ON "users" ("refresh_token") `);
    }

}
