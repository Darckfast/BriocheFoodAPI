import { PedidoController } from '@controllers/PedidoController'
import { autorizar } from '@middleware/Autorizacao'
import { Router } from 'express'
import { body } from 'express-validator'

const pedidoRouter = Router()
const pedidoController = new PedidoController()

pedidoRouter.post('/',
  autorizar('', false),
  body('carrinho').isArray().notEmpty(),
  body('carrinho.*.produtoId').isString().isLength({ min: 50, max: 64 }),
  body('carrinho.*.quantidade').isInt({ min: 1 }),
  body('pagamento').isObject().notEmpty(),
  body('pagamento.numero_cartao').isString().isLength({ min: 16, max: 16 }).notEmpty(),
  body('pagamento.cvv').isString().isLength({ min: 3, max: 4 }).notEmpty(),
  body('pagamento.data_expiracao').isString().isLength({ min: 4, max: 4 }).notEmpty(),
  body('pagamento.nome').isString().isLength({ min: 3, max: 255 }).notEmpty().matches(/^[a-zA-Z0-9 ]*$/),
  body('envio').isObject().notEmpty(),
  body('envio.nome').isString().isLength({ min: 3, max: 255 }).notEmpty().matches(/^[a-zA-Z0-9 ]*$/),
  body('envio.endereco').isObject().notEmpty(),
  body('envio.endereco.estado').isString().notEmpty().isLength({ min: 2, max: 2 }),
  body('envio.endereco.cidade').isString().notEmpty().isLength({ min: 2, max: 255 }),
  body('envio.endereco.bairro').isString().notEmpty().isLength({ min: 2, max: 255 }),
  body('envio.endereco.rua').isString().notEmpty().isLength({ min: 2, max: 255 }),
  body('envio.endereco.numero').isString().matches(/^[a-zA-Z0-9 ]*$/).notEmpty().isLength({ min: 1, max: 255 }),
  body('envio.endereco.cep').isString().notEmpty().isLength({ min: 8, max: 8 }),
  pedidoController.criar)

export {
  pedidoRouter
}
