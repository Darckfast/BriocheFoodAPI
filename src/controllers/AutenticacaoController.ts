import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { JWEUtils } from 'src/services/JWEUtils'
import { SenhaNaoConfere } from 'src/erros/SenhaNaoConfere'
import { UsuarioNaoExisteErro } from 'src/erros/UsuarioNaoExiste'
import { autenticarUsuario } from 'src/services/UsuarioService'
import { log } from '@utils/CriarLogger'

class AutenticacaoController {
  async autenticar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      log.warn('Payload para autenticacao invalido', errors)

      return res.status(400).json({
        mensagem: 'payload invalido'
      })
    }

    const { senha, login } = req.body

    try {
      const autenConteudo = { ...await autenticarUsuario(login, senha), sub: login }

      const jwe = await new JWEUtils().gerarJWE(autenConteudo)

      return res.header('Authorization', 'Bearer ' + jwe).status(200).json({
        mensagem: 'autenticado'
      })
    } catch (e) {
      if (e instanceof SenhaNaoConfere || e instanceof UsuarioNaoExisteErro) {
        return res.status(401).json({
          mensagem: 'credenciais invalidas'
        })
      }

      log.error('Erro na autenticacao', e)
      return res.status(500).json({ mensagem: 'erro interno' })
    }
  }
}

export { AutenticacaoController }
