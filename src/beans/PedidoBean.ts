
export interface Carrinho {
  produtoId: string
  quantidade: number
}

export interface Endereco {
  estado: string
  cidade: string
  bairro: string
  rua: string
  numero: string
  cep: string
}

export interface Envio {
  nome: string
  endereco: Endereco
}

export interface Pagamento {
  numero_cartao: string
  cvv: string
  data_expiracao: string
  nome: string
}

export interface Pedido {
  carrinho: Carrinho[]
  pagamento: Pagamento
  envio: Envio
}
