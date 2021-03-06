import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('pedido')
class Pedido {
  @PrimaryGeneratedColumn({ name: 'ped_id' })
  id: number

  @Column({ name: 'est_id' })
  estabelecimentoId: number

  @Column({ name: 'usu_id' })
  usuarioId: number

  @Column({ name: 'pro_id' })
  produtoId: number

  @Column({ name: 'ped_status' })
  status: number

  @Column({ name: 'ped_quantidade' })
  quantidade: number

  @Column({ name: 'ped_total' })
  total: number

  @Column({ name: 'ped_protocolo' })
  protocolo: number

  @Column({ name: 'ped_transacao_id' })
  transacaoId: number

  @CreateDateColumn({ name: 'ped_data', insert: false })
  pedidoEm: Date
}

export { Pedido }
