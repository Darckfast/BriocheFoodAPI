import { UsuarioController } from './controllers/UsuarioController'
import { AutenticacaoController } from './controllers/AutenticacaoController'
import { Router } from 'express'
import { body, oneOf, query } from 'express-validator'
import { EstabelecimentoController } from '@controllers/EstabelecimentoController'
import { ProdutoController } from '@controllers/ProdutoController'
import { cnpj, cpf } from 'cpf-cnpj-validator'
import { PedidoController } from '@controllers/PedidoController'

const router = Router()

const usuarioController = new UsuarioController()
const autenticacaoController = new AutenticacaoController()
const estabelecimentoController = new EstabelecimentoController()
const produtoController = new ProdutoController()
const pedidoController = new PedidoController()

router.post(
  '/api/v1/usuario',
  body('email').isEmail().not().isEmpty().normalizeEmail(),
  body('login').isLength({ min: 5, max: 255 }).matches(/^[a-zA-Z0-9.@_]*$/).not().isEmpty().trim(),
  body('senha').isLength({ min: 8, max: 255 }),
  body('nome').isLength({ min: 3, max: 255 }).matches(/^[a-zA-Z0-9 .-@_]*$/).trim(),
  body('tipo').isIn([0, 1]).isNumeric(),
  usuarioController.criar)

router.post('/api/v1/auth',
  body('senha').isLength({ min: 8, max: 255 }),
  body('login').isLength({ min: 5, max: 255 }).matches(/^[a-zA-Z0-9.@_]*$/).not().isEmpty().trim(),
  autenticacaoController.autenticar)

router.post('/api/v1/estabelecimento',
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

// Adicionado validacao array
router.post('/api/v1/produto',
  body('produtos').isArray().notEmpty(),
  produtoController.cadastrar)

router.get('/api/v1/produto',
  query('pagina').isInt({ min: 0 }),
  query('itens').isInt({ min: 1, max: 10 }),
  produtoController.buscar)

router.post('/api/v1/pedido',
  pedidoController.criar)

export { router }
