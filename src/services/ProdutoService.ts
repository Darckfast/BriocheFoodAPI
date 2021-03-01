import { IDInvalidoErro } from '@erro/IDInvalidoErro'
import { ProdutoNaoExisteErro } from '@erro/ProdutoNaoExisteErro'
import { Produto } from '@models/Produto'
import { ProdutoRepository } from '@repository/ProdutoRepository'
import { log } from '@utils/CriarLogger'
import { getCustomRepository } from 'typeorm'
import { criptografarString, descriptografarString } from './Cripta'
import { buscarEstabelecimento, buscarEstabelecimentoPorId } from './EstabelecimentoService'

const cadastrarProdutos = async (produtos: [{ nome: string, preco: number, quantidade: number }], login: string) => {
  const produtoRepo = getCustomRepository(ProdutoRepository)
  const estabelecimento = await buscarEstabelecimento(login)

  if (!produtos) {
    // lista vazia
  }

  if (!estabelecimento) {
    // nao possui estabelecimento

    return
  }

  const produtosCadastrados: any[] = []

  log.info('Cadastrando %s produtos', produtos.length)

  for (const produtoRaw of produtos) {
    const { nome, preco, quantidade } = produtoRaw

    let produto = produtoRepo.create({
      preco, nome, quantidade, estabelecimentoId: estabelecimento.id
    })

    produto = await produtoRepo.save(produto)

    log.info('Produto ( %s ) cadastrado', produto.nome)

    produtosCadastrados.push({
      id: criptografarString(produto.id), // Enc
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade
    })
  }

  return produtosCadastrados
}

const buscarProdutos = async (pagina = 0, itens = 10) => {
  const produtoRepo = getCustomRepository(ProdutoRepository)

  log.info('Buscando produtos')

  const produtos = await produtoRepo.find({
    order: { id: 'DESC' },
    skip: pagina * itens,
    take: itens
  })

  for (const produto of produtos) {
    const estabelecimento = await buscarEstabelecimentoPorId(produto.estabelecimentoId)

    Object.assign(produto,
      {
        id: criptografarString(produto.id),
        estabelecimento: estabelecimento?.nome,
        estabelecimentoId: criptografarString(estabelecimento?.id)
      })
  }

  log.info('%s produtos encontrados', produtos.length)

  return {
    conteudo: produtos,
    total: produtos.length
  }
}

const buscarProdutoPorIdHash = async (idHash: string): Promise<Produto> => {
  if (!idHash) {
    throw new IDInvalidoErro()
  }

  const id = parseInt(descriptografarString(idHash))

  const produtoRepo = getCustomRepository(ProdutoRepository)
  const produto = await produtoRepo.findOne({ id })

  if (!produto) {
    throw new ProdutoNaoExisteErro('Produto nao encontrado ' + id)
  }

  return produto
}

export { cadastrarProdutos, buscarProdutos, buscarProdutoPorIdHash }
