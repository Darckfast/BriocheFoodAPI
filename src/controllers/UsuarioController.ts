
import { log } from '@utils/CriarLogger'
import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { SenhaFracaErro } from '../erros/SenhaFracaErro'
import { UsuarioExisteErro } from '../erros/UsuarioExiste'
import { criarUsuario } from '../services/UsuarioService'

class UsuarioController {
  async criar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      log.warn('Payload para criar usuario invalido', errors)

      return res.status(400).json({
        mensagem: 'payload invalido'
      })
    }

    const { nome, login, senha, tipo, email } = req.body

    try {
      await criarUsuario(nome, login, senha, tipo, email)

      return res.status(200).json({
        mensagem: 'usuario criado'
      })
    } catch (e) {
      if (e instanceof UsuarioExisteErro) {
        return res.status(400).json({
          mensagem: 'login conflitante'
        })
      }

      if (e instanceof SenhaFracaErro) {
        return res.status(400).json({
          mensagem: 'nivel minimo nao atendido'
        })
      }

      log.error('Erro interno', e)
      return res.status(500).json({
        mensagem: 'erro interno'
      })
    }
  }

  async editar (req: Request, res: Response) {
    //
  }
}

export { UsuarioController }
