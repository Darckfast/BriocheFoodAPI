import 'reflect-metadata'
import express from 'express'
import createConnection from './db'
import { router } from './routes'
import { validarEnvs } from './utils/ValidarEnvs'
import actuator, { Options } from 'express-actuator'

const app = express()

const actuatorOptions: Options = {
  basePath: '/api/v1'
}

app.use(express.json())
app.use(router)
app.use(actuator(actuatorOptions))

validarEnvs()
createConnection()

export { app }
