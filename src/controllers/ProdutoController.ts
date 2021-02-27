import { JWEUtils } from '@services/JWEUtils'
import { cadastrarProdutos, buscarProdutos } from '@services/ProdutoService'
import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class ProdutoController {
  async cadastrar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log('Payload para cadastrar produtos nao passou na validacao', errors)

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
      console.log(e)

      return res.status(500).json({
        mensagem: 'erro interno'
      })
    }
  }

  async buscar (req: Request, res: Response) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log('Payload para cadastrar produtos nao passou na validacao', errors)

      return res.status(400).json({
        mensagem: 'payload invalido'
      })
    }

    const { pagina, itens } = req.query
    try {
      const produtos = await buscarProdutos(pagina, itens)

      return res.status(200).json(produtos)
    } catch (e) {
      return res.status(500).json({ mensagem: 'erro interno' })
    }
  }
}

export {
  ProdutoController
}
