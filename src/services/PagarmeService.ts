/* eslint-disable camelcase */
import { Envio, Pagamento } from '@beans/PedidoBean'
import { Recebedor } from '@beans/RecebedorBean'
import { PagamentoRecusado } from '@erro/PagamentoRecusadoErro'
import { PagarmeErro } from '@erro/PagarmeErro'
import { log } from '@utils/CriarLogger'
import { request } from 'https'

const criarRecebedor = async (recebedor: Recebedor) => {
  return new Promise<string>((resolve, reject) => {
    log.info('Criando recebedor na Pagar.me')

    const payload = JSON.stringify({
      api_key: process.env.PAGARME_API_KEY,
      bank_account: {
        bank_code: recebedor.codigo_banco,
        agencia: recebedor.agencia,
        agencia_dv: recebedor.agencia_dv,
        conta: recebedor.conta,
        type: 'conta_corrente',
        conta_dv: recebedor.conta_dv,
        document_number: recebedor.numero_documento,
        legal_name: recebedor.nome_legal
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

const criarTransacao = async (pagamento: Pagamento, envio: Envio, total: number, recebedorId: string) => {
  return new Promise<string>((resolve, reject) => {
    const valorConvertido = (total * 100).toFixed(0)

    log.info('Criando transacao na Pagar.me com valor convertido %s', valorConvertido)

    const payload = JSON.stringify({
      api_key: process.env.PAGARME_API_KEY,
      amount: valorConvertido,
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
      },
      split_rules: [
        {
          recipient_id: process.env.RE_ID,
          percentage: 15,
          liable: true,
          charge_processing_fee: true
        },
        {
          recipient_id: recebedorId,
          percentage: 85,
          liable: false,
          charge_processing_fee: false
        }
      ]
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
        const { status, errors, tid } = JSON.parse(chunk)

        if (!tid) {
          log.error('Transaction ID nao encontrado na respostad da pagar.me')
          return reject(new PagarmeErro('transaction id vazio ' + res.statusCode))
        }

        if (res.statusCode !== 200) {
          log.error('Erro na chama a Pagar.me - %s', JSON.stringify(errors))
          return reject(new PagarmeErro('transactions ' + res.statusCode))
        }

        log.info('Transacao criada na Pagar.me com status [%s]', status)
        if (status !== 'paid') {
          return reject(new PagamentoRecusado('Transacao retornada com status ' + status))
        }

        resolve(tid)
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
