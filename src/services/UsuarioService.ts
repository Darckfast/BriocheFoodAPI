import { PersistenciaErro } from '@erro/PersistenciaErro'
import { SenhaFracaErro } from '@erro/SenhaFracaErro'
import { SenhaNaoConfere } from '@erro/SenhaNaoConfere'
import { UsuarioExisteErro } from '@erro/UsuarioExiste'
import { UsuarioNaoExisteErro } from '@erro/UsuarioNaoExiste'
import { Usuario } from '@models/Usuario'
import { UsuarioRepository } from '@repository/UsuarioRepository'
import { log } from '@utils/CriarLogger'
import { getCustomRepository } from 'typeorm'
import zxcvbn from 'zxcvbn'
import { comparaSenha, gerarHashString } from '../utils/Cripta'

const criarUsuario = async (nome: string, login: string, senha: string, tipo: number, email: string) => {
  const usuarioRepo = getCustomRepository(UsuarioRepository)
  const usuarioExiste = await usuarioRepo.findOne({ login: login.toLowerCase() })

  log.info('Validando se usuario ja existe')
  if (usuarioExiste) {
    log.warn('Login ja existe')
    throw new UsuarioExisteErro('Usuario ja existem com esse login')
  }

  log.info('Validando forca da senha')
  // Tornar configuravel
  if (zxcvbn(senha).score < 4) {
    log.info('Senha nao atingiu a forca minima')
    throw new SenhaFracaErro('Senha nao atende a forca minima')
  }

  const senhaCripta = gerarHashString(senha)

  const usuario = usuarioRepo.create({
    nome, login: login.toLocaleLowerCase(), senha: senhaCripta, tipo, email
  })

  await persistirUsuario(usuario)
}

const buscarUsuarioPorLogin = async (login: string): Promise<Usuario | undefined> => {
  const usuarioRepo = getCustomRepository(UsuarioRepository)

  return await usuarioRepo.findOne({ login: login.toLowerCase() })
}

const persistirUsuario = async (usuario: Usuario) => {
  const usuarioRepo = getCustomRepository(UsuarioRepository)

  log.info('Persistindo usuario')

  try {
    await usuarioRepo.save(usuario)

    log.info('Usuario persistido')
  } catch (e) {
    log.error('Erro duante a persistencia do usuario', e)

    throw new PersistenciaErro('Erro na persistencia do usuario')
  }
}

const autenticarUsuario = async (login: string, senha: string): Promise<{ acesso: number }> => {
  const usuarioRepo = getCustomRepository(UsuarioRepository)
  const usuarioPersistido = await usuarioRepo.findOne({ login: login.toLowerCase() })

  log.info('Validando se usuario ja existe')
  if (!usuarioPersistido) {
    log.warn('Login nao existe')

    throw new UsuarioNaoExisteErro('Usuario nao existe com esse login')
  }

  const senhaConfere = comparaSenha(senha, usuarioPersistido.senha)

  if (!senhaConfere) {
    log.warn('Senha nao confere')
    throw new SenhaNaoConfere('Senha nao confere')
  }

  return { acesso: usuarioPersistido.tipo }
}

export { criarUsuario, autenticarUsuario, buscarUsuarioPorLogin }
