import { autenticacaoRouter } from '@routes/AutenticacaoRouter'
import { estabelecimentoRouter } from '@routes/EstabelecimentoRouter'
import { pedidoRouter } from '@routes/PedidoRouter'
import { produtoRouter } from '@routes/ProdutoRouter'
import { usuarioRouter } from '@routes/UsuarioRouter'
import { Router } from 'express'

const router = Router()

router.use('/auth', autenticacaoRouter)
router.use('/usuario', usuarioRouter)
router.use('/estabelecimento', estabelecimentoRouter)
router.use('/produto', produtoRouter)
router.use('/pedido', pedidoRouter)

export { router }
