
### Criando o DB

Para criar o database execute:

```bash
docker run --name main-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD="senha_super_secreta" -d mysql
```

```bash
docker exec -it main-db sh
```

```bash
mysql -u root -p senha_super_secreta
```

```bash
create database briochefood_db;

create user 'briochefood_api'@'%' identified by 'senha_secreta_da_minha_api';

grant CREATE, DELETE, INSERT, SELECT, UPDATE, ALTER, REFERENCES on briochefood_db.* to 'briochefood_api'@'%';

show grants for 'briochefood_api'@'%';
```

Isso vai criar um usuário no db com o login `briochefood_api` e a senha `senha_secreta_da_minha_api`


### Configurando o .env para desenvolvimento

Para configurar os segredos e as credencias crie um `.env` na raiz do projeto (esse arquivo é ignorado no push) com as seguintes envs:

```
PAGARME_API_KEY=api_da_pagarme
API_ENC_KEY=string_super_secreta
RSA_AUTH_PRI_KEY=chave_rsa_privada
RSA_AUTH_PUB_KEY=chava_rsa_publica
TYPEORM_HOST=host_do_db
TYPEORM_USERNAME=usuario_do_db
TYPEORM_PASSWORD=senha_do_usuario
TYPEORM_DATABASE=database_a_ser_usado
TYPEORM_PORT=porta_do_db
```

Para teste e desenvolvimento as chaves RSA podem ser geradas usando alguma ferramenta online como [Online RSA Key Generator](https://travistidwell.com/jsencrypt/demo/)

Para o uso em produção, é recomendado a geração das chaves usando openssl, e elas devem ser armazenadas em um cofre de segredos como o [Vault](https://www.vaultproject.io/) ou [AWS Secrets Manager](https://aws.amazon.com/pt/secrets-manager)

// Nao testado

```bash
openssl genrsa -des3 -out private.pem 2048

openssl rsa -in private.pem -outform PEM -pubout -out public.pem

openssl rsa -in private.pem -out private_unencrypted.pem -outform PEM
```