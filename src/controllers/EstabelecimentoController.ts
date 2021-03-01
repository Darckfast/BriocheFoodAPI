import { EstabelecimentoBean } from '@beans/EstabelecimentoBean'
import { ConflitoEstabelecimentoErro } from '@erro/ConflitoEstabelecimentoErro'
import { TokenFaltandoErro } from '@erro/TokenFaltandoErro'
import { TokenInvalidoErro } from '@erro/TokenInvalidoErro'
import { cadastrarEstabelecimento } from '@services/EstabelecimentoService'
import { JWEUtils } from '@services/JWEUtils'
import { log } from '@utils/CriarLogger'
import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class EstabelecimentoController {
  async criar (req: Request, res: Response) {
    try {
      const { sub } = await new JWEUtils().verificarJWE(req.header('Authorization'))

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        log.warn('Payload para criar estabelecimento invalido', errors)

        return res.status(400).json({
          mensagem: 'payload invalido'
        })
      }

      const estabelecimentoBean: EstabelecimentoBean = req.body
      await cadastrarEstabelecimento(estabelecimentoBean, sub)

      return res.status(200).json({
        mensagem: 'estabelecimento criado'
      })
    } catch (e) {
      if (e instanceof TokenFaltandoErro) {
        return res.status(401).json({
          mensagem: 'nao autorizado'
        })
      }

      if (e instanceof TokenInvalidoErro) {
        return res.status(401).json({
          mensagem: 'nao autorizado'
        })
      }

      if (e instanceof ConflitoEstabelecimentoErro) {
        return res.status(400).json({
          mensagem: 'requisicao invalida'
        })
      }

      return res.status(500).json({
        mensagem: 'erro interno'
      })
    }
  }
}

export { EstabelecimentoController }
