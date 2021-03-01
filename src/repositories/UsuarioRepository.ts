import { Usuario } from '@models/Usuario'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Usuario)
class UsuarioRepository extends Repository<Usuario> {}

export { UsuarioRepository }
