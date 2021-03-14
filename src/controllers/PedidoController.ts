import { Pedido } from '@beans/PedidoBean'
import { IDInvalidoErro } from '@errors/IDInvalidoErro'
import { ProdutoNaoExisteErro } from '@errors/ProdutoNaoExisteErro'
import { ProdutoVazioErro } from '@errors/ProdutoVazioErro'
import { QuantidadeErro } from '@errors/QuantidadeErro'
import { PedidoService } from '@services/PedidoService'
import { log } from '@utils/CriarLogger'
import { JWEUtils } from '@utils/JWEUtils'
import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class PedidoController {
  pedidoService: PedidoService = new PedidoService()

  async criar (req: Request, res: Response) {
    try {
      const bearer = req.header('Authorization')

      let sub: string | null = null
      if (bearer) {
        const jweUtils = new JWEUtils(req.header('Authorization'))
        sub = await jweUtils.extrairCampo('sub') as string
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        log.warn('Payload para criar produto invalido', errors)

        return res
          .status(400)
          .json({
            mensagem: 'payload invalido'
          })
      }

      const pedido: Pedido = req.body

      const pedidoId = await new PedidoService().criarPedido(pedido, sub)

      return res
        .status(200)
        .json({
          mensagem: 'pedido realizado',
          pedidoId
        })
    } catch (e) {
      if (e instanceof QuantidadeErro ||
        e instanceof IDInvalidoErro ||
        e instanceof ProdutoNaoExisteErro ||
        e instanceof ProdutoVazioErro) {
        return res
          .status(400)
          .json({
            mensagem: 'requisicao invalida'
          })
      }

      log.error('Erro interno na geracao do pedido', e)

      return res
        .status(500)
        .json({ mensagem: 'erro interno' })
    }
  }
}

export {
  PedidoController
}
