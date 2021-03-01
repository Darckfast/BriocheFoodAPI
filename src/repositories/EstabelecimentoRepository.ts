import { Estabelecimento } from '@models/Estabelecimento'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Estabelecimento)
class EstabelecimentoRepository extends Repository<Estabelecimento> {

}

export { EstabelecimentoRepository }
