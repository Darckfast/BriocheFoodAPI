import { Produto } from '@models/Produto'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Produto)
class ProdutoRepository extends Repository<Produto> {}

export { ProdutoRepository }
