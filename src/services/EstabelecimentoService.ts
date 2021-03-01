import { EstabelecimentoBean } from '@beans/EstabelecimentoBean'
import { ConflitoEstabelecimentoErro } from '@erro/ConflitoEstabelecimentoErro'
import { NaoEncontradoErro } from '@erro/NaoEncontradoErro'
import { Estabelecimento } from '@models/Estabelecimento'
import { EstabelecimentoRepository } from '@repository/EstabelecimentoRepository'
import { log } from '@utils/CriarLogger'
import { getCustomRepository } from 'typeorm'
import { criarRecebedor } from './PagarmeService'
import { buscarUsuarioPorLogin } from './UsuarioService'

const cadastrarEstabelecimento = async (estabele: EstabelecimentoBean, login: string) => {
  const estabelecimentoRepo = getCustomRepository(EstabelecimentoRepository)

  const usuario = await buscarUsuarioPorLogin(login)
  const temEstabelecimento = await estabelecimentoRepo.findOne({ usuId: usuario?.id })

  if (!usuario || temEstabelecimento) {
    log.warn('Usuario ja possui estabelecimento cadastrado')

    throw new ConflitoEstabelecimentoErro('Usuario nao existe ou possui estabelecimento cadastrado')
  }

  const recebedorId = await criarRecebedor(estabele)

  const estabelecimento = estabelecimentoRepo.create({
    nome: estabele.nome, usuId: usuario.id, recebedorId
  })

  log.info('Criando estabelecimento')

  await estabelecimentoRepo.save(estabelecimento)

  log.info('Estabelecimento criado')
}

const buscarEstabelecimento = async (login: string): Promise<Estabelecimento | undefined> => {
  const estabelecimentoRepo = getCustomRepository(EstabelecimentoRepository)

  const usuario = await buscarUsuarioPorLogin(login)
  return await estabelecimentoRepo.findOne({ usuId: usuario?.id })
}

const buscarEstabelecimentoPorId = async (id: number): Promise<Estabelecimento> => {
  const estabelecimentoRepo = getCustomRepository(EstabelecimentoRepository)

  const estabelecimento = await estabelecimentoRepo.findOne({ id })

  if (!estabelecimento) {
    throw new NaoEncontradoErro('Estabelecimento nao encontrado ' + id)
  }

  return estabelecimento
}

export { cadastrarEstabelecimento, buscarEstabelecimento, buscarEstabelecimentoPorId }
