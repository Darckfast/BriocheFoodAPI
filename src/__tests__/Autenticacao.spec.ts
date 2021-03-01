import { app } from '../app'
import request from 'supertest'
import { gerarStringRandom } from '../utils/StringRandom'
import { Connection, getConnection } from 'typeorm'

describe('autenticacao', () => {
  let connection: Connection

  beforeEach(async () => {
    if (!connection) {
      connection = getConnection()
      await connection.connect()
    }
  })

  test('autenticar usuario - 200', (done) => {
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
          .expect(200, done)
      })
  })

  test('autenticar usuario - 401', (done) => {
    const login = gerarStringRandom()
    const senha = gerarStringRandom(16)

    const auth = {
      login,
      senha
    }

    request(app)
      .post('/api/v1/auth')
      .send(auth)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done)
  })
})
