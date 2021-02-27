import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('produto')
class Produto {
  @PrimaryGeneratedColumn({ name: 'pro_id' })
  id: number

  @Column({ name: 'pro_nome' })
  nome: string

  @Column({ name: 'pro_preco' })
  preco: number

  @Column({ name: 'pro_quantidade' })
  quantidade: number

  @Column({ name: 'est_id' })
  estabelecimentoId: number
}

export { Produto }
