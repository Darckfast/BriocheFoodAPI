import { JWEUtils } from '../services/JWEUtils'

describe('JWE', () => {
  it('criar JWE', async () => {
    const jweString = await new JWEUtils().gerarJWE({ test: 1 })

    expect(jweString).not.toBeNull()
    expect(jweString).toContain('.')
  })

  it('obter conteudo', async () => {
    const jweString = await new JWEUtils().gerarJWE({ test: 1 })
    const conteudo = await new JWEUtils().getConteudo(jweString)

    expect(conteudo).not.toBeNull()
    expect(conteudo.test).toBe(1)
  })

  it('verificar JWE', async () => {
    const jweString = await new JWEUtils().gerarJWE({ test: 1 })
    const resultado = await new JWEUtils().verificarJWE(jweString)

    expect(resultado).toBe(true)
  })

  it('verificar JWE invalido', async () => {
    const jweString = await new JWEUtils().gerarJWE({ test: 1 })
    const resultado = await new JWEUtils().verificarJWE(jweString.concat('1'))

    expect(resultado).toBe(false)
  })
})
