import { app } from '../app'
import request from 'supertest'
import { gerarStringRandom } from '../utils/StringRandom'
import { Connection, getConnection } from 'typeorm'

describe('produto', () => {
  let connection: Connection

  beforeEach(async () => {
    if (!connection) {
      connection = getConnection()
      await connection.connect()
    }
  })

  test('cadastrando produto - 200', (done) => {
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
                  .expect(200, done)
              })
          })
      })
  })

  test('cadastrando produto faltando param - 400', (done) => {
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
                      preco: 2.55
                    },
                    {
                      nome: 'Suco de laranja',
                      preco: 3.5
                    }
                  ]
                }

                request(app)
                  .post('/api/v1/produto')
                  .send(produtos)
                  .set('Content-Type', 'application/json')
                  .set('Authorization', authorization)
                  .expect('Content-Type', /json/)
                  .expect(400, done)
              })
          })
      })
  })

  test('buscar produto - 200', (done) => {
    request(app)
      .get('/api/v1/produto')
      .query({ pagina: 0, itens: 10 })
      .expect('Content-Type', /json/)
      .expect(/conteudo/)
      .expect(/total/)
      .expect(200, done)
  })

  test('buscar produto itens alem do limite - 400', (done) => {
    request(app)
      .get('/api/v1/produto')
      .query({ pagina: 0, itens: 100 })
      .expect('Content-Type', /json/)
      .expect(400, done)
  })

  test('buscar produto pagina negativa - 400', (done) => {
    request(app)
      .get('/api/v1/produto')
      .query({ pagina: -1, itens: 100 })
      .expect('Content-Type', /json/)
      .expect(400, done)
  })

  test('buscar produto sem query - 400', (done) => {
    request(app)
      .get('/api/v1/produto')
      .expect('Content-Type', /json/)
      .expect(400, done)
  })
})
