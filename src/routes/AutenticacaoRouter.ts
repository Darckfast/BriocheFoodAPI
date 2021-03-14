import { AutenticacaoController } from '@controllers/AutenticacaoController'
import { Router } from 'express'
import { body } from 'express-validator'

const autenticacaoRouter = Router()
const autenticacaoController = new AutenticacaoController()

autenticacaoRouter.post('/',
  body('senha').isLength({ min: 8, max: 255 }),
  body('login').isLength({ min: 5, max: 255 }).matches(/^[a-zA-Z0-9.@_]*$/).not().isEmpty().trim(),
  autenticacaoController.autenticar)

export {
  autenticacaoRouter
}
