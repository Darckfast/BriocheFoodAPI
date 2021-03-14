import { buscarProdutos, cadastrarProdutos } from '@services/ProdutoService'
import { log } from '@utils/CriarLogger'
import { JWEUtils } from '@utils/JWEUtils'
import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class ProdutoController {
  async cadastrar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      log.warn('Payload para criar produto invalido', errors)

      return res.status(400).json({
        mensagem: 'payload invalido'
      })
    }

    const { produtos } = req.body
    const { sub } = await new JWEUtils().verificarJWE(req.header('Authorization'))

    try {
      const produtosCadastrados = await cadastrarProdutos(produtos, sub)

      return res.status(200).json(produtosCadastrados)
    } catch (e) {
      log.error('Erro interno na criacao de produto', e)

      return res.status(500).json({
        mensagem: 'erro interno'
      })
    }
  }

  async buscar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      log.warn('Payload para buscar produtos invalido', errors)

      return res.status(400).json({
        mensagem: 'payload invalido'
      })
    }

    const { pagina, itens } = req.query as {[key: string]: string}

    try {
      const produtos = await buscarProdutos(parseInt(pagina), parseInt(itens))

      return res.status(200).json(produtos)
    } catch (e) {
      return res.status(500).json({ mensagem: 'erro interno' })
    }
  }
}

export {
  ProdutoController
}
