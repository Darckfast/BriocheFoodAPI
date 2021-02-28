import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CriadoProcolotoSeq1614537647854 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'protocolo',
      columns: [
        {
          name: 'protocolo',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('protocolo')
  }
}
