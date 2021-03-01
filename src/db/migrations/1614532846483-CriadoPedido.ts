import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CriadoPedido1614532846483 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'pedido',
      columns: [
        {
          name: 'ped_id',
          type: 'int unsigned',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'ped_data',
          type: 'timestamp',
          default: 'current_timestamp'
        },
        {
          name: 'est_id',
          type: 'int unsigned'
        },
        {
          name: 'usu_id',
          type: 'int unsigned',
          isNullable: true
        },
        {
          name: 'pro_id',
          type: 'int unsigned'
        },
        {
          name: 'ped_status',
          type: 'tinyint'
        },
        {
          name: 'ped_quantidade',
          type: 'int unsigned'
        },
        {
          name: 'ped_total',
          type: 'float'
        },
        {
          name: 'ped_protocolo',
          type: 'int unsigned'
        }
      ]
    }))

    const foreignKeyEst = new TableForeignKey({
      columnNames: ['est_id'],
      referencedColumnNames: ['est_id'],
      referencedTableName: 'estabelecimento'
    })

    const foreignKeyUsu = new TableForeignKey({
      columnNames: ['usu_id'],
      referencedColumnNames: ['usu_id'],
      referencedTableName: 'usuario'
    })

    const foreignKeyPro = new TableForeignKey({
      columnNames: ['pro_id'],
      referencedColumnNames: ['pro_id'],
      referencedTableName: 'produto'
    })

    await queryRunner.createForeignKey('pedido', foreignKeyEst)
    await queryRunner.createForeignKey('pedido', foreignKeyPro)
    await queryRunner.createForeignKey('pedido', foreignKeyUsu)

    // Criar index
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pedido', 'est_id')
    await queryRunner.dropForeignKey('pedido', 'usu_id')
    await queryRunner.dropForeignKey('pedido', 'pro_id')
    await queryRunner.dropTable('pedido')
  }
}
