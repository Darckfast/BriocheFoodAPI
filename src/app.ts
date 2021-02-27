import 'reflect-metadata'
import express from 'express'
import createConnection from './db'
import { router } from './routes'
import { validarEnvs } from './utils/ValidarEnvs'

const app = express()

app.use(express.json())
app.use(router)

validarEnvs()
createConnection()

export { app }
