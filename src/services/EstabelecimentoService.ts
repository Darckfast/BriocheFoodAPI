import { ConflitoEstabelecimentoErro } from '@erro/ConflitoEstabelecimentoErro'
import { Estabelecimento } from '@models/Estabelecimento'
import { EstabelecimentoRepository } from '@repository/EstabelecimentoRepository'
import { log } from '@utils/CriarLogger'
import { EstabelecimentoBean } from 'src/beans/EstabelecimentoBean'
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

const buscarEstabelecimentoPorId = async (id: number): Promise<Estabelecimento | undefined> => {
  const estabelecimentoRepo = getCustomRepository(EstabelecimentoRepository)

  return await estabelecimentoRepo.findOne({ id })
}

export { cadastrarEstabelecimento, buscarEstabelecimento, buscarEstabelecimentoPorId }
