import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlteradoPedido1614547623697 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('pedido', new TableColumn({
      name: 'ped_transacao_id',
      type: 'int unsigned'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pedido', 'ped_transacao_id')
  }
}
