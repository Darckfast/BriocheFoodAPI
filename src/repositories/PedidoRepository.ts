import { Pedido } from '@models/Pedido'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Pedido)
class PedidoRepository extends Repository<Pedido> { }

export { PedidoRepository }
