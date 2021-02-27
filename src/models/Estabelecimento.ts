import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('estabelecimento')
class Estabelecimento {
  @PrimaryGeneratedColumn({ name: 'est_id' })
  id: number

  @Column({ name: 'est_nome' })
  nome: string

  @CreateDateColumn({ name: 'est_criado_em', insert: false })
  criadoEm: Date

  @Column({ name: 'usu_id' })
  usuId: number

  @Column({ name: 'rec_id' })
  recebedorId: string
}

export { Estabelecimento }
