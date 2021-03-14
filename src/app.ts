import { log } from '@utils/CriarLogger'
import express, { NextFunction, Request, Response } from 'express'
import actuator, { Options } from 'express-actuator'
import 'reflect-metadata'
import createConnection from './db'
import { router } from './routes'
import { validarEnvs } from '@utils/ValidarEnvs'

const app = express()

const actuatorOptions: Options = {
  basePath: '/api/v1'
}

app.use(express.json())

app.use('/api/v1', router)

app.use(actuator(actuatorOptions))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error('Erro na requisicao %s', req.path, err)

  return res.status(500).json({
    mensagem: 'erro interno'
  })
})

validarEnvs()
createConnection()

export { app }
