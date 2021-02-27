import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CriarUsuarios1614113316556 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'usu_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'usu_nome',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'usu_email',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'usu_criado_em',
            type: 'timestamp',
            default: 'current_timestamp'
          },
          {
            name: 'usu_tipo',
            type: 'tinyint'
          },
          {
            name: 'usu_login',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'usu_senha',
            type: 'varchar',
            length: '512'
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario')
  }
}
