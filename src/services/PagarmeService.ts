/* eslint-disable camelcase */
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

export {
  criarRecebedor
}
