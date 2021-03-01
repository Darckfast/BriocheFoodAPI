import { app } from '../app'
import request from 'supertest'
import { gerarStringRandom } from '../utils/StringRandom'
import { Connection, getConnection } from 'typeorm'

describe('usuario', () => {
  let connection: Connection

  beforeEach(async () => {
    if (!connection) {
      connection = getConnection()
      await connection.connect()
    }
  })

  test('criar usuario - 200', (done) => {
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
      .expect(200, done)
  })

  test('criar usuario - 400', (done) => {
    const login = gerarStringRandom(1)
    const senha = gerarStringRandom(1)

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
      .expect(400, done)
  })
})
