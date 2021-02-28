import { TokenFaltandoErro } from '@erro/TokenFaltandoErro';
import { TokenInvalidoErro } from '@erro/TokenInvalidoErro';
import { log } from '@utils/CriarLogger'
import { JWK, JWE } from 'node-jose'

class JWEUtils {
  keystore = JWK.createKeyStore();

  privateKey: string = process.env.RSA_AUTH_PRI_KEY || ''
  publicKey: string = process.env.RSA_AUTH_PUB_KEY || ''

  async gerarJWE (payload: Object): Promise<string> {
    const key = await JWK.asKey(this.publicKey, 'pem', { alg: 'RSA-OAEP-256', use: 'enc' })

    const jweConteudo = JSON.stringify({
      ...payload,
      exp: new Date().setHours(new Date().getHours() + 1),
      iat: new Date().getTime()
    })

    const jweString =
      await JWE.createEncrypt({
        format: 'compact',
        contentAlg: 'A256GCM'
      }, key)
        .update(jweConteudo)
        .final()

    return jweString
  }

  async getConteudo (jwe: string | undefined): Promise<any> {
    if (!jwe) {
      return null
    }

    if (jwe.startsWith('Bearer')) {
      jwe = jwe.replace('Bearer ', '')
    }

    const key = await JWK.asKey(this.privateKey, 'pem', { alg: 'RSA-OAEP-256', use: 'enc' })

    const jweConteudo = (await JWE.createDecrypt(key, {
      algorithms: ['RSA-OAEP-256', 'A256GCM']
    }).decrypt(jwe)).payload.toString()

    return JSON.parse(jweConteudo)
  }

  async verificarJWE (jwe: string | undefined): Promise<any> {
    if (!jwe) {
      log.error('Bearer vazio')

      throw new TokenFaltandoErro('Bearer vazio')
    }

    if (jwe.startsWith('Bearer')) {
      jwe = jwe.replace('Bearer ', '')
    }

    try {
      return await this.getConteudo(jwe)
    } catch (e) {
      log.error('Bearer invalido', e)

      throw new TokenInvalidoErro('Bearer invalido')
    }
  }
}

export { JWEUtils }
