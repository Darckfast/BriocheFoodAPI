import { app } from './app'
import { log } from '@utils/CriarLogger'

app.listen(3333, () => log.info('App iniciado :)'))
