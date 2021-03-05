import { JWEUtils } from '../utils/JWEUtils'

describe('JWE', () => {
  it('criar JWE', async () => {
    const jweUtils = new JWEUtils()
    await jweUtils.gerarJWE({ test: 1 })
    const jweString = jweUtils.formatado()

    expect(jweString).not.toBeNull()
    expect(jweString).toContain('.')
  })

  it('obter conteudo', async () => {
    const jweUtils = new JWEUtils()
    await jweUtils.gerarJWE({ test: 1 })
    const conteudo = await jweUtils.extrairConteudo()

    expect(conteudo).not.toBeNull()
    expect(conteudo.test).toBe(1)
  })

  it('verificar JWE', async () => {
    const jweUtils = new JWEUtils()

    await jweUtils.gerarJWE({ test: 1 })
    await jweUtils.verificarBearer()
  })

  it('verificar JWE invalido', async () => {
    let erro = false
    const jweUtils = new JWEUtils('teste')

    await jweUtils.verificarBearer()
      .catch(e => { erro = true })

    expect(erro).toBe(true)
  })
})
