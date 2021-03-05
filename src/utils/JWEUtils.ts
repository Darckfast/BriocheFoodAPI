import { TokenFaltandoErro } from '@erro/TokenFaltandoErro'
import { TokenInvalidoErro } from '@erro/TokenInvalidoErro'
import { log } from '@utils/CriarLogger'
import { JWK, JWE } from 'node-jose'

class JWEUtils {
  private jwe: string
  private conteudo: any
  private key: JWK.Key

  constructor (jwe: string = '') {
    this.jwe = jwe
  }

  keystore = JWK.createKeyStore();

  privateKey: string = process.env.RSA_AUTH_PRI_KEY as string
  publicKey: string = process.env.RSA_AUTH_PUB_KEY as string

  async gerarJWE (payload: Object): Promise<void> {
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

    this.jwe = jweString
  }

  formatado (): string {
    return 'Bearer ' + this.jwe
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
    log.info('Validando bearer')
    if (!jwe) {
      log.error('Bearer vazio')

      throw new TokenFaltandoErro('Bearer vazio')
    }

    if (jwe.startsWith('Bearer')) {
      jwe = jwe.replace('Bearer ', '')
    }

    try {
      const conteudo = await this.getConteudo(jwe)
      const { exp } = conteudo
      const tempoAtual = new Date().getTime()
      if (exp < tempoAtual) {
        log.warn('Bearer de autenticacao expirado por %s', tempoAtual - exp)

        throw new TokenInvalidoErro('Bearer expirado')
      }

      return conteudo
    } catch (e) {
      log.error('Bearer invalido', e)

      throw new TokenInvalidoErro('Bearer invalido')
    }
  }

  async verificarBearer (): Promise<void> {
    log.info('Verificando bearer')

    if (this.jwe.startsWith('Bearer')) {
      this.jwe = this.jwe.replace('Bearer ', '')
    }

    try {
      const { exp } = await this.getConteudo(this.jwe)
      const tempoAtual = new Date().getTime()

      if (exp < tempoAtual) {
        log.warn('Bearer de autenticacao expirado por %s', tempoAtual - exp)

        throw new TokenInvalidoErro('Bearer expirado')
      }

      this.extrairConteudo()
    } catch (e) {
      log.error('Bearer invalido', e)

      throw new TokenInvalidoErro('Bearer invalido')
    }
  }

  async extrairConteudo (): Promise<any> {
    if (this.jwe.startsWith('Bearer')) {
      this.jwe = this.jwe.replace('Bearer ', '')
    }
    this.key = await JWK.asKey(this.privateKey, 'pem', { alg: 'RSA-OAEP-256', use: 'enc' })

    this.conteudo = JSON.parse((
      await JWE.createDecrypt(this.key, {
        algorithms: ['RSA-OAEP-256', 'A256GCM']
      }).decrypt(this.jwe))
      .payload.toString())

    return this.conteudo
  }

  async extrairCampo (campo: string): Promise<string | number | object | boolean> {
    return this.conteudo[campo]
  }

  async verificarAcesso (acesso: string): Promise<void> {
    if (!acesso) {
      log.info('Nenhum acesso especificado')
      return
    }

    log.info('Verificando acesso %s', acesso)
    const possuiAcesso = acesso.includes(this.conteudo.acessos)

    if (!possuiAcesso) {
      throw new Error('Nao possui acesso ' + acesso)
    }
  }
}

export { JWEUtils }
