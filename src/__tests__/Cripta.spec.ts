import { criptografarString, comparaSenha, gerarHashString } from '../utils/Cripta'

describe('cripta', () => {
  it('criptografar senha', () => {
    const texto = 'conteudo a ser criptografado'

    const textoCript = criptografarString(texto)

    expect(textoCript).not.toEqual(texto)
  })

  it('comparar senha', () => {
    const texto = 'conteudo a ser criptografado'

    const textoCript = gerarHashString(texto)

    const resultado = comparaSenha(texto, textoCript)

    expect(resultado).toEqual(true)
  })

  it('comparar senha incorreta', () => {
    const texto = 'conteudo a ser criptografado'

    const textoCript = criptografarString(texto)

    const resultado = comparaSenha(texto.concat('1'), textoCript)

    expect(resultado).toEqual(false)
  })
})
