import { EstabelecimentoController } from '@controllers/EstabelecimentoController'
import { autorizar } from '@middleware/Autorizacao'
import { Router } from 'express'
import { body, oneOf } from 'express-validator'
import { cnpj, cpf } from 'cpf-cnpj-validator'

const estabelecimentoRouter = Router()
const estabelecimentoController = new EstabelecimentoController()

estabelecimentoRouter.post('/',
  autorizar(),
  body('nome').isLength({ min: 3, max: 255 }).matches(/^[a-zA-Z0-9 .-@_]*$/),
  body('codigo_banco').isString().isLength({ min: 3, max: 3 }),
  body('agencia').isString().isLength({ min: 1, max: 16 }),
  body('agencia_dv').isString().isLength({ min: 1, max: 4 }),
  body('conta').isString().isLength({ min: 1, max: 16 }),
  body('conta_dv').isString().isLength({ min: 1, max: 4 }),
  body('nome_legal').isString().isLength({ min: 3, max: 255 }),
  oneOf([
    body('numero_documento').isString().isLength({ min: 11, max: 11 })
      .custom(val => {
        if (cpf.isValid(val)) {
          return true
        }

        throw new Error('CPF invalido')
      }),
    body('numero_documento').isString().isLength({ min: 14, max: 14 })
      .custom(val => {
        if (cnpj.isValid(val)) {
          return true
        }

        throw new Error('CPNJ invalido')
      })
  ]),
  estabelecimentoController.criar)

export {
  estabelecimentoRouter
}
