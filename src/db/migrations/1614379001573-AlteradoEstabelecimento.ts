import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlteradoEstabelecimento1614379001573 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('estabelecimento', new TableColumn({
      name: 'rec_id',
      type: 'varchar',
      length: '255'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('estabelecimento', 'rec_id')
  }
}
