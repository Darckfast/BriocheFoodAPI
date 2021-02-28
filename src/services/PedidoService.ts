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

class PedidoService {
  @Transaction()
  async criarPedido (
    @TransactionRepository(PedidoRepository) pedidoRepository: PedidoRepository,
    @TransactionRepository(ProdutoRepository) produtoRepository: ProdutoRepository,
      pedidoPayload: Pedido, login: string): Promise<string> {
    log.info('Validando itens')
    const prodValidados = await validarProdutos(pedidoPayload.carrinho)

    let usuario: Usuario | undefined

    if (login) {
      usuario = await buscarUsuarioPorLogin(login)
    }

    const protocolo = await gerarProtocolo()

    for (const item of prodValidados.itens) {
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

      log.info('[%s] - Pedido criado', protocolo)

      await pedidoRepository.save(pedido)
    }

    const pedidoId = criptografarString(protocolo)

    await criarTransacao(pedidoPayload.pagamento, pedidoPayload.envio, prodValidados.total)

    return pedidoId
  }
}

const validarProdutos = async (itens: Carrinho[]) => {
  if (!itens) {
    // new erro
  }

  const produtosNoCarrinho = []
  let total = 0

  for (const item of itens) {
    const produto = await buscarProdutoPorIdHash(item.produtoId)

    if (produto.quantidade < item.quantidade) {
      throw new Error('Quantidade em estoque inferior a comprada')
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
