import { ProtocoloRepository } from '@repository/ProtocoloRepository'
import { getCustomRepository } from 'typeorm'

const gerarProtocolo = async (): Promise<number> => {
  const protocoloRepo = getCustomRepository(ProtocoloRepository)

  const { protocolo } = await protocoloRepo.save(protocoloRepo.create())
  const quantidadeZeros = 4 - protocolo.toString().length

  return parseInt(`${new Date().getFullYear()}${'0'.repeat(quantidadeZeros)}${protocolo}`)
}

export {
  gerarProtocolo
}
