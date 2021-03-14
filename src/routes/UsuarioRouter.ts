import { UsuarioController } from '@controllers/UsuarioController'
import { Router } from 'express'
import { body } from 'express-validator'

const usuarioRouter = Router()
const usuarioController = new UsuarioController()

usuarioRouter.post('/',
  body('email').isEmail().not().isEmpty().normalizeEmail(),
  body('login').isLength({ min: 5, max: 255 }).matches(/^[a-zA-Z0-9.@_]*$/).not().isEmpty().trim(),
  body('senha').isLength({ min: 8, max: 255 }),
  body('nome').isLength({ min: 3, max: 255 }).matches(/^[a-zA-Z0-9 .-@_]*$/).trim(),
  body('tipo').isIn([0, 1]).isNumeric(),
  usuarioController.criar)

export {
  usuarioRouter
}
