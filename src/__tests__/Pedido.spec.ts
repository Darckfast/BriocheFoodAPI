import { app } from '../app'
import request from 'supertest'
import { gerarStringRandom } from '../utils/StringRandom'
import { Connection, getConnection } from 'typeorm'

describe('pedido', () => {
  let connection: Connection

  beforeEach(async () => {
    if (!connection) {
      connection = getConnection()
      await connection.connect()
    }
  })

  test('gerando pedido - 200', (done) => {
    const login = gerarStringRandom()
    const senha = gerarStringRandom(16)

    const usuario = {
      login,
      senha,
      tipo: 0,
      nome: 'Usuario de teste',
      email: 'email@teste.com.br'
    }

    request(app)
      .post('/api/v1/usuario')
      .send(usuario)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(() => {
        const auth = {
          login,
          senha
        }

        request(app)
          .post('/api/v1/auth')
          .send(auth)
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect('Authorization', /Bearer/)
          .expect(200).end((err, res) => {
            if (err) {
              return done(err)
            }

            const nome = gerarStringRandom()

            const estabelecimento = {
              nome,
              codigo_banco: '237',
              agencia: '1935',
              agencia_dv: '9',
              conta: '23398',
              conta_dv: '9',
              nome_legal: 'API BANK ACCOUNT',
              numero_documento: '26268738888'
            }

            const { authorization } = res.headers

            request(app)
              .post('/api/v1/estabelecimento')
              .send(estabelecimento)
              .set('Content-Type', 'application/json')
              .set('Authorization', authorization)
              .expect('Content-Type', /json/)
              .expect(200)
              .end(() => {
                const produtos = {
                  produtos: [
                    {
                      nome: 'Café',
                      preco: 2.55,
                      quantidade: 500
                    },
                    {
                      nome: 'Suco de laranja',
                      preco: 3.5,
                      quantidade: 300
                    }
                  ]
                }

                request(app)
                  .post('/api/v1/produto')
                  .send(produtos)
                  .set('Content-Type', 'application/json')
                  .set('Authorization', authorization)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end((err, res) => {
                    if (err) {
                      done(err)
                    }

                    const prodId = res.body[0].id as string

                    const pedido = {
                      carrinho: [
                        {
                          produtoId: prodId,
                          quantidade: 1
                        }
                      ],
                      pagamento: {
                        numero_cartao: '4111111111111111',
                        cvv: '132',
                        data_expiracao: '0922',
                        nome: 'Morpheus Fishburne'
                      },
                      envio: {
                        nome: 'Neo Reeves',
                        endereco: {
                          estado: 'sp',
                          cidade: 'Cotia',
                          bairro: 'Rio Cotia',
                          rua: 'Rua Matrix',
                          numero: '9999',
                          cep: '06714360'
                        }
                      }
                    }

                    request(app)
                      .post('/api/v1/pedido')
                      .send(pedido)
                      .set('Content-Type', 'application/json')
                      .expect('Content-Type', /json/)
                      .expect(/mensagem/)
                      .expect(/pedidoId/)
                      .expect(200, done)
                  })
              })
          })
      })
  })

  test('gerar pedido cartao invalido - 500', (done) => {
    request(app)
      .get('/api/v1/produto')
      .query({ pagina: 0, itens: 10 })
      .expect('Content-Type', /json/)
      .expect(/conteudo/)
      .expect(/total/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        const prodId = res.body.conteudo[0].id
        const qtd = res.body.conteudo[0].quantidade

        const pedido = {
          carrinho: [
            {
              produtoId: prodId,
              quantidade: 1
            }
          ],
          pagamento: {
            numero_cartao: '4111111111111112',
            cvv: '132',
            data_expiracao: '0922',
            nome: 'Morpheus Fishburne'
          },
          envio: {
            nome: 'Neo Reeves',
            endereco: {
              estado: 'sp',
              cidade: 'Cotia',
              bairro: 'Rio Cotia',
              rua: 'Rua Matrix',
              numero: '9999',
              cep: '06714360'
            }
          }
        }

        request(app)
          .post('/api/v1/pedido')
          .send(pedido)
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(500)
          .end((err) => {
            if (err) done(err)

            request(app)
              .get('/api/v1/produto')
              .query({ pagina: 0, itens: 10 })
              .expect('Content-Type', /json/)
              .expect(/conteudo/)
              .expect(/total/)
              .expect(200)
              .then(res => { expect(res.body.conteudo[0].quantidade).toEqual(qtd); done() })
          })
      })
  })

  test('gerar pedido faltando informacao - 400', (done) => {
    const pedido = {
      carrinho: [],
      pagamento: {
        numero_cartao: '4111111111111111',
        cvv: '132',
        data_expiracao: '0922',
        nome: 'Morpheus Fishburne'
      },
      envio: {
        nome: 'Neo Reeves',
        endereco: {
          estado: 'sp',
          cidade: 'Cotia',
          bairro: 'Rio Cotia',
          rua: 'Rua Matrix',
          numero: '9999',
          cep: '06714360'
        }
      }
    }

    request(app)
      .post('/api/v1/pedido')
      .send(pedido)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done)
  })
})
