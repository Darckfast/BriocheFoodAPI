import { Carrinho, Pedido } from '@beans/PedidoBean'
import { Usuario } from '@models/Usuario'
import { PedidoRepository } from '@repository/PedidoRepository'
import { ProdutoRepository } from '@repository/ProdutoRepository'
import { log } from '@utils/CriarLogger'
import { Transaction, TransactionRepository } from 'typeorm'
import { criptografarString } from './Cripta'
import { buscarProdutoPorIdHash } from './ProdutoService'
import { gerarProtocolo } from './ProtocoloService'
import { buscarUsuarioPorLogin } from './UsuarioService'
import { criarTransacao } from './PagarmeService'
import { QuantidadeErro } from '@erro/QuantidadeErro'
import { ProdutoVazioErro } from '@erro/ProdutoVazioErro'
import { buscarEstabelecimentoPorId } from './EstabelecimentoService'

class PedidoService {
  @Transaction()
  async criarPedido (
    pedidoPayload: Pedido, login: string,
    @TransactionRepository(PedidoRepository) pedidoRepository?: PedidoRepository,
    @TransactionRepository(ProdutoRepository) produtoRepository?: ProdutoRepository): Promise<string> {
    if (!pedidoRepository || !produtoRepository) {
      // Workaround para a issue #1828 do typeorm com typescript
      throw new Error('Repositorio nao injetado devidamente')
    }

    log.info('Validando itens')
    const prodValidados = await validarProdutos(pedidoPayload.carrinho)

    let usuario: Usuario | undefined

    if (login) {
      usuario = await buscarUsuarioPorLogin(login)
    }

    const protocolo = await gerarProtocolo()
    const pedidoId = criptografarString(protocolo)

    for (const item of prodValidados.itens) {
      const { recebedorId } = await buscarEstabelecimentoPorId(item.estabelecimentoId)

      log.info('Dando baixa no item %s (%s)', item.id, item.quantidade)
      produtoRepository.atualizarQuantidade(item.id, item.quantidade)
      log.info('Baixa do item %s (%s) feita com sucesso', item.id, item.quantidade)

      const pedido = pedidoRepository.create({
        estabelecimentoId: item.estabelecimentoId,
        produtoId: item.id,
        status: 0,
        quantidade: item.quantidade,
        total: item.total,
        usuarioId: usuario?.id,
        protocolo
      })

      log.info('[%s] - Pedido criado - valor %s', protocolo, pedido.total)

      log.info('Criando transcao para o pedido [%s] com o total %s', pedidoId, prodValidados.total)
      const tid = await criarTransacao(pedidoPayload.pagamento, pedidoPayload.envio, pedido.total, recebedorId)

      pedido.transacaoId = parseInt(tid)

      await pedidoRepository.save(pedido)
    }

    log.info('Transacao [%s] concluida com sucesso', pedidoId)
    return pedidoId
  }
}

const validarProdutos = async (itens: Carrinho[]) => {
  if (!itens) {
    throw new ProdutoVazioErro()
  }

  const produtosNoCarrinho = []
  let total = 0

  for (const item of itens) {
    const produto = await buscarProdutoPorIdHash(item.produtoId)

    if (produto.quantidade < item.quantidade) {
      log.warn('Quantidade em estoque (%s) inferior a comprada (%s)',
        produto.quantidade, item.quantidade)

      throw new QuantidadeErro('Quantidade em estoque inferior a comprada')
    }

    const prodCarrinho = {
      ...item,
      preco_individual: produto.preco,
      id: produto.id,
      total: item.quantidade * produto.preco,
      estabelecimentoId: produto.estabelecimentoId
    }

    produtosNoCarrinho.push(prodCarrinho)

    total += prodCarrinho.total
  }

  return { itens: produtosNoCarrinho, total }
}

export {
  PedidoService
}
