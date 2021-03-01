import 'reflect-metadata'
import express from 'express'
import type { Request, Response } from 'express'
import createConnection from './db'
import { router } from './routes'
import { validarEnvs } from './utils/ValidarEnvs'
import actuator, { Options } from 'express-actuator'
import { log } from '@utils/CriarLogger'

const app = express()

const actuatorOptions: Options = {
  basePath: '/api/v1'
}

app.use(express.json())
app.use(router)
app.use(actuator(actuatorOptions))

app.use((err: Error, req: Request, res: Response) => {
  log.error('Erro na requisicao %s', req.path, err)

  res.status(500).json({
    mensagem: 'erro interno'
  })
})

validarEnvs()
createConnection()

export { app }
