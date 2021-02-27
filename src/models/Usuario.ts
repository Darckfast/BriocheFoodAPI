import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn({ name: 'usu_id' })
  id: number

  @Column({ name: 'usu_nome' })
  nome: string

  @Column({ name: 'usu_email' })
  email: string

  @CreateDateColumn({ name: 'usu_criado_em', insert: false })
  criadoEm: Date

  @Column({ name: 'usu_tipo' })
  tipo: number

  @Column({ name: 'usu_senha' })
  senha: string

  @Column({ name: 'usu_login' })
  login: string
}

export { Usuario }
