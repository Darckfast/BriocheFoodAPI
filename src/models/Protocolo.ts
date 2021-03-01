import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('protocolo')
class Protocolo {
  @PrimaryGeneratedColumn({ name: 'protocolo' })
  protocolo: number
}

export { Protocolo }
