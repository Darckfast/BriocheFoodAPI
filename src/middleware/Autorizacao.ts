import { log } from '@utils/CriarLogger'
import { JWEUtils } from '@utils/JWEUtils'
import type { NextFunction, Request, Response } from 'express'

const autorizar = (acesso: string = '', requerido: boolean = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization && requerido) {
      return res.status(401).json({
        mensagem: 'nao autorizado'
      })
    } else if (!authorization && !requerido) {
      return next()
    }

    try {
      const jweUtils = new JWEUtils(authorization)

      await jweUtils.verificarBearer()
      await jweUtils.verificarAcesso(acesso)
    } catch (e) {
      log.error(e)

      return res.status(401).json({
        mensagem: 'nao autorizado'
      })
    }

    return next()
  }
}

export {
  autorizar
}
