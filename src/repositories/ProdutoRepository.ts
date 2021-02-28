import { Produto } from '@models/Produto'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Produto)
class ProdutoRepository extends Repository<Produto> {
  atualizarQuantidade (id: number, qtdComprada: number) {
    this.manager.createQueryBuilder()
      .update(Produto)
      .set({
        quantidade: () => `pro_quantidade - ${qtdComprada}`
      })
      .where('id = :id', { id })
      .execute()
  }
}

export { ProdutoRepository }
