import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlteradoPedido1614539022434 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('estabelecimento', 'usu_id', new TableColumn({
      name: 'usu_id',
      type: 'int'
    }))

    await queryRunner.changeColumn('pedido', 'usu_id', new TableColumn({
      name: 'usu_id',
      type: 'int',
      isNullable: true
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
  }
}
