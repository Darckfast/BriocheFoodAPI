import { log } from '@utils/CriarLogger'
import { compareSync, hashSync } from 'bcrypt'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const gerarHashString = (senha: string, skipCripta = false) => {
  const senha256 = createHash('sha256').update(senha).digest('hex')

  if (skipCripta) {
    return senha256
  }

  return criptografarString(hashSync(senha256, 13))
}

const criptografarString = (valor: string | number | undefined): string => {
  if (!valor) {
    log.error('Tentativa de criptografar uma string vazia')
    return ''
  }

  const key: string = createHash('md5').update(process.env.API_ENC_KEY || '').digest('hex')

  const iv = Buffer.from(randomBytes(16))
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  const senhaCript = cipher.update(valor.toString(), 'utf-8', 'base64') + cipher.final('base64')
  const tag = cipher.getAuthTag().toString('base64')

  return iv.toString('base64') + tag + senhaCript
}

const descriptografarString = (valor: string) => {
  const key: string = createHash('md5').update(process.env.API_ENC_KEY || '').digest('hex')

  const ivString = valor.substr(0, 24)
  const tagString = valor.substr(24, 24)

  const iv = Buffer.from(ivString, 'base64')
  const tag = Buffer.from(tagString, 'base64')

  const valorSemIv = valor.split(tagString)[1]

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)

  return decipher.update(valorSemIv, 'base64', 'utf-8') + decipher.final('utf-8')
}

const comparaSenha = (senha: string, senhaCript: string): boolean => {
  const senha256 = gerarHashString(senha, true)

  const senhaDoUsuario = descriptografarString(senhaCript)
  return compareSync(senha256, senhaDoUsuario)
}

export { comparaSenha, gerarHashString, criptografarString, descriptografarString }
