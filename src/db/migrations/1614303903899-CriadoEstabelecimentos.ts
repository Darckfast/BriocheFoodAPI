import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CriadoEstabelecimentos1614303903899 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'estabelecimento',
        columns: [
          {
            name: 'est_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'est_nome',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'usu_id',
            type: 'int',
            isUnique: true
          },
          {
            name: 'est_criado_em',
            type: 'timestamp',
            default: 'current_timestamp'
          }
        ]
      })
    )

    const foreignKey = new TableForeignKey({
      columnNames: ['usu_id'],
      referencedColumnNames: ['usu_id'],
      referencedTableName: 'usuario'
    })

    await queryRunner.createForeignKey('estabelecimento', foreignKey)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('estabelecimento', 'usu_id')
    await queryRunner.dropTable('estabelecimentos')
  }
}
