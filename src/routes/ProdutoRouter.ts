import { ProdutoController } from '@controllers/ProdutoController'
import { autorizar } from '@middleware/Autorizacao'
import { Router } from 'express'
import { body, query } from 'express-validator'

const produtoRouter = Router()
const produtoController = new ProdutoController()

produtoRouter.post('/',
  autorizar(),
  body('produtos').isArray().notEmpty(),
  body('produtos.*.nome').isString().notEmpty(),
  body('produtos.*.preco').isFloat({ min: 0.1 }),
  body('produtos.*.quantidade').isInt({ min: 1 }),
  produtoController.cadastrar)

produtoRouter.get('/',
  autorizar('', false),
  query('pagina').isInt({ min: 0 }),
  query('itens').isInt({ min: 1, max: 10 }),
  produtoController.buscar)

export {
  produtoRouter
}
