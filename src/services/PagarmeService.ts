/* eslint-disable camelcase */
import { Envio, Pagamento } from '@beans/PedidoBean'
import { PagarmeErro } from '@erro/PagarmeErro'
import { log } from '@utils/CriarLogger'
import { request } from 'https'

const criarRecebedor = async ({
  codigo_banco,
  agencia,
  agencia_dv,
  conta,
  conta_dv,
  nome_legal,
  numero_documento
}) => {
  return new Promise<string>((resolve, reject) => {
    log.info('Criando recebedor na Pagar.me')

    const payload = JSON.stringify({
      api_key: process.env.PAGARME_API_KEY,
      bank_account: {
        bank_code: codigo_banco,
        agencia,
        agencia_dv,
        conta,
        type: 'conta_corrente',
        conta_dv,
        document_number: numero_documento,
        legal_name: nome_legal
      },
      transfer_day: '5',
      transfer_enabled: 'true',
      transfer_interval: 'weekly'
    })

    const options = {
      method: 'POST',
      hostname: 'api.pagar.me',
      port: null,
      path: '/1/recipients',
      headers: {
        'content-type': 'application/json',
        'Content-Length': payload.length
      }
    }

    const req = request(options, (res) => {
      let chunk = ''
      res.on('data', d => {
        chunk += d
      })

      res.on('end', () => {
        if (res.statusCode !== 200) {
          log.error('Erro na chama a Pagar.me', chunk)
          return reject(new PagarmeErro('recipients ' + res.statusCode))
        }

        const { id } = JSON.parse(chunk)
        log.info('Recepiente criado na Pagar.me')

        resolve(id)
      })
    })

    req.write(payload)

    req.on('error', e => reject(e))

    req.end()
  })
}

const criarTransacao = async (pagamento: Pagamento, envio: Envio, total: number) => {
  return new Promise<string>((resolve, reject) => {
    log.info('Criando recebedor na Pagar.me')

    const payload = JSON.stringify({
      api_key: process.env.PAGARME_API_KEY,
      amount: total * 100,
      card_number: pagamento.numero_cartao,
      card_cvv: pagamento.cvv,
      card_expiration_date: pagamento.data_expiracao,
      card_holder_name: pagamento.nome,
      shipping: {
        name: envio.nome,
        fee: 1000,
        delivery_date: '2000-12-21',
        expedited: true,
        address: {
          country: 'br',
          state: envio.endereco.estado,
          city: envio.endereco.cidade,
          neighborhood: envio.endereco.bairro,
          street: envio.endereco.rua,
          street_number: envio.endereco.numero,
          zipcode: envio.endereco.cep
        }
      }
    })

    const options = {
      method: 'POST',
      hostname: 'api.pagar.me',
      port: null,
      path: '/1/transactions',
      headers: {
        'content-type': 'application/json',
        'Content-Length': payload.length
      }
    }

    const req = request(options, (res) => {
      let chunk = ''
      res.on('data', d => {
        chunk += d
      })

      res.on('end', () => {
        if (res.statusCode !== 200) {
          log.error('Erro na chama a Pagar.me', chunk)
          return reject(new PagarmeErro('transactions ' + res.statusCode))
        }

        const { id } = JSON.parse(chunk)
        log.info('Transacao criada na Pagar.me')

        resolve(id)
      })
    })

    req.write(payload)

    req.on('error', e => reject(e))

    req.end()
  })
}

export {
  criarRecebedor,
  criarTransacao
}
