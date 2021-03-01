import { app } from '../app'
import request from 'supertest'
import { gerarStringRandom } from '../utils/StringRandom'
import { Connection, getConnection } from 'typeorm'

describe('estabelecimento', () => {
  let connection: Connection

  beforeEach(async () => {
    if (!connection) {
      connection = getConnection()
      await connection.connect()
    }
  })

  test('criar estabelecimento - 200', (done) => {
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
              .expect(200, done)
          })
      })
  })

  test('criar estabelecimento - 401', (done) => {
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

    request(app)
      .post('/api/v1/estabelecimento')
      .send(estabelecimento)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done)
  })

  test('criar estabelecimento - 400', (done) => {
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
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            const nome = gerarStringRandom()

            const estabelecimento = {
              nome
            }

            const { authorization } = res.headers

            request(app)
              .post('/api/v1/estabelecimento')
              .send(estabelecimento)
              .set('Content-Type', 'application/json')
              .set('Authorization', authorization)
              .expect('Content-Type', /json/)
              .expect(400, done)
          })
      })
  })
})
