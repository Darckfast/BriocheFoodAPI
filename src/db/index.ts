import { log } from '@utils/CriarLogger'
import { Connection, createConnection } from 'typeorm'

export default async (): Promise<Connection> => {
  log.info('Criando conexao com o db')
  return createConnection()
}
