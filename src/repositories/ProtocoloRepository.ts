import { Protocolo } from '@models/Protocolo'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Protocolo)
class ProtocoloRepository extends Repository<Protocolo> {}

export { ProtocoloRepository }
