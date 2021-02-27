import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CriadoProduto1614306477541 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produto',
        columns: [
          {
            name: 'pro_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'pro_nome',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'pro_preco',
            type: 'float'
          },
          {
            name: 'pro_quantidade',
            type: 'int'
          },
          {
            name: 'est_id',
            type: 'int'
          }
        ]
      })
    )

    const foreignKey = new TableForeignKey({
      columnNames: ['est_id'],
      referencedColumnNames: ['est_id'],
      referencedTableName: 'estabelecimento'
    })

    await queryRunner.createForeignKey('produto', foreignKey)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('produto', 'est_id')
    await queryRunner.dropTable('produto')
  }
}
