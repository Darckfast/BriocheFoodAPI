const gerarStringRandom = (tamanho: number = 6) => {
  let resultado = ''
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }

  return resultado
}

export {
  gerarStringRandom
}
