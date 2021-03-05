import { UsuarioController } from './controllers/UsuarioController'
import { Router } from 'express'
import { body, oneOf, query } from 'express-validator'
import { EstabelecimentoController } from '@controllers/EstabelecimentoController'
import { ProdutoController } from '@controllers/ProdutoController'
import { cnpj, cpf } from 'cpf-cnpj-validator'
import { PedidoController } from '@controllers/PedidoController'
import { autorizar } from './middleware/Autorizacao'
import { AutenticacaoController } from '@controllers/AutenticacaoController'

const router = Router()

const usuarioController = new UsuarioController()
const estabelecimentoController = new EstabelecimentoController()
const produtoController = new ProdutoController()
const pedidoController = new PedidoController()
const autenticacaoController = new AutenticacaoController()

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

router.post('/api/v1/produto',
  autorizar(),
  body('produtos').isArray().notEmpty(),
  body('produtos.*.nome').isString().notEmpty(),
  body('produtos.*.preco').isFloat({ min: 0.1 }),
  body('produtos.*.quantidade').isInt({ min: 1 }),
  produtoController.cadastrar)

router.get('/api/v1/produto',
  autorizar('', false),
  query('pagina').isInt({ min: 0 }),
  query('itens').isInt({ min: 1, max: 10 }),
  produtoController.buscar)

router.post('/api/v1/pedido',
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

export { router }
