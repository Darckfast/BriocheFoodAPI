import { log } from './CriarLogger'

const validarEnvs = () => {
  const envs = [
    'PAGARME_API_KEY',
    'API_ENC_KEY',
    'RSA_AUTH_PRI_KEY',
    'RSA_AUTH_PUB_KEY',
    'TYPEORM_HOST',
    'TYPEORM_USERNAME',
    'TYPEORM_PASSWORD',
    'TYPEORM_DATABASE',
    'TYPEORM_PORT',
    'NODE_ENV'
  ]

  envs.forEach(env => {
    if (process.env[env]) {
      log.info('[%s] - ok', env)
    } else {
      log.error('[%s] - nao carregada', env)
    }
  })
}

export {
  validarEnvs
}
