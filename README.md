# BriocheFoodAPI

## Rodando a API

Esta API possui uma [imagem Docker](https://hub.docker.com/r/darckfast/briochefoodapi)

Para executar essa API é necessário configurar um banco MySQL 8 e para isso basta seguir as instruções abaixo

Chaves RSA e outros segredos tambem são necessários. Para facilitar o teste/desenvolvimento, dentro do diretorio `src/__test__` há os seguintes arquivos `_test.pem`, `_test.pub` e `.test.env` que possuem chaves usadas somente para **teste** e não devem ser usadas em produção

### Criando o DB

Para criar o database execute:

```bash
docker run --name main-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD="senha_super_secreta" -d mysql
```

```bash
docker exec -it main-db sh
```

```bash
mysql -u root -p 
#> Enter password: senha_super_secreta
```

```bash
create database api_db;

create user 'usuario_api'@'%' identified by 'senha_super_secreta';

grant CREATE, DELETE, INSERT, SELECT, UPDATE, ALTER, REFERENCES on api_db.* to 'usuario_api'@'%';

show grants for 'usuario_api'@'%';

quit

exit
```

Isso vai criar um usuário no db com o login `usuario_api` com a senha `senha_super_secreta`

Instale as dependências e execute as migrations

```bash
yarn && yarn typeorm migration:run
```

### Docker
**Para teste/desenvolvimento é possível usar as chaves RSA providas no diretório `src/__tests__`**

Para rodar a imagem Docker da API execute:

```bash
docker run -it \
  -p 3333:3333 \
  --env-file src/__tests__/.test.env \
  -e RSA_AUTH_PRI_KEY="$(cat src/__tests__/_test.pem)" \
  -e RSA_AUTH_PUB_KEY="$(cat src/__tests__/_test.pub)" \
  -e PAGARME_API_KEY=api_key_pagar_me \
  -e RE_ID=id_do_recebedor_principal \
  -e TYPEORM_HOST=ip_do_host_do_db \
  darckfast/briochefoodapi
```

A `PAGARME_API_KEY` (api key) e `RE_ID` (id do recebedor) ambos podem ser obtidos na Dashboard da Pagar.me

### Configurando as envs

Para configurar os segredos e as credencias crie um `.env` na raiz do projeto, ou copie o `.test.env` do diretório `src/__test__` para a raiz do projeto com o nome `.env`, (esse arquivo é ignorado no push) com as seguintes envs:

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

## Endpoints
Para facilitar os testes dos endpoints, no diretorio `src/__tests__` inclui o `insomnia.json` que contem as chamadas REST dos endpoints no formato do Insomnia, para usar basta instalar o [Insomnia](https://insomnia.rest/download/) e `Application -> Preferences -> Data -> Import Data -> From File` isso vai importar um *Workspace* chamada `BriocheFoodAPI` com as chamadas

### Usuario

Este endpoint permite a criação de usuário (necessário para cadastrar um estabelecimento)

```http
POST /api/v1/usuario HTTP/1.1
Host: localhost:3333
Content-Type: application/json
Accept: application/json
Content-Length: 135

{
 	"login": "login_do_usuario",
 	"senha": "senha_do_usuario",
 	"nome": "primeiro usuario",
 	"tipo": 0,
 	"email": "email@gmail.com.br"
}
```

#### Cadastro com sucesso

```http
HTTP/1.1 200 OK

{
  "mensagem": "usuario criado"
}
```


### Autenticação

Este endpoint faz a autenticação do usuário, a autenticação é necessária para realizar algumas operações

```http
POST /api/v1/auth HTTP/1.1
Host: localhost:3333
Content-Type: application/json
Accept: application/json
Content-Length: 52

{
 	"login": "login_do_usuario",
 	"senha": "senha_do_usuario"
}
```

#### Autenticação com sucesso

O *Bearer* de autenticação é retornado na responta no *header* **Authorization**

```http
HTTP/1.1 200 OK
Authorization: Bearer eyJlbmMiOiJBMjU2R0NNIiwi...
```

### Estabelecimento

Este endpoint permite a criação de estabelecimentos (necessário para cadastrar produtos) e requer um usuário autenticado

```http
POST /api/v1/estabelecimento HTTP/1.1
Host: localhost:3333
Content-Type: application/json
Authorization: Bearer eyJlbmMiOiJBMjU2R0NNIiw...
Accept: application/json
Content-Length: 210

{
	"nome": "Nome do estabelecimento",
	"codigo_banco": "237",
	"agencia": "1935",
	"agencia_dv": "9",
	"conta": "23398",
	"conta_dv": "9",
	"nome_legal": "API BANK ACCOUNT",
	"numero_documento": "26268738888"
}
```

#### Cadastro com sucesso

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
	"login": "login_do_usuario",
	"senha": "senha_do_usuario"
}
```

### Produto
#### Cadastro

Este endpoint permite o cadastro de produtos para um estabelecimento (o usuário autenticado deve possuir um estabelecimento cadastrado)

```http
POST /api/v1/produto HTTP/1.1
Host: localhost:3333
Content-Type: application/json
Authorization: Bearer eyJlbmMiOiJBMjU2R0NNIiwi....
Accept: application/json
Content-Length: 165

 {
 	"produtos": [
 		{
 			"nome": "Café",
 			"preco": 2.55,
 			"quantidade": 500
 		},
 		{
 			"nome": "Suco de laranja",
 			"preco": 3.5,
 			"quantidade": 300
 		}
	]
}
```

#### Cadastro com sucesso

```http
HTTP/1.1 200 OK

[
  {
    "id": "vwHIyiXtbJykNBePvBmcJA==VvOmoGz+sqNB3qXTF18qMA==lg==",
    "nome": "Café",
    "preco": 2.55,
    "quantidade": 500
  },
  {
    "id": "KgZKWLGuTVRFdLSeP2+wNg==BuRyZKlqoJAdIp2RXyd+pg==9A==",
    "nome": "Suco de laranja",
    "preco": 3.5,
    "quantidade": 300
  }
]
```

#### Busca

Retorna, com paginação, todos os produtos cadastrados

```http
GET /api/v1/produto?pagina=0&itens=10 HTTP/1.1
Host: localhost:3333
Accept: application/json
```

#### Busca com sucesso

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2160
Date: Mon, 01 Mar 2021 01:22:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "conteudo": [
    {
      "id": "derr8Q+cI9grTkTqKJkDUA==X3RvLKtWSMqw8LvSPZKGGQ==KAg=",
      "nome": "Suco de laranja",
      "preco": 3.5,
      "quantidade": 300,
      "estabelecimentoId": "vfQBJMOBEpRrEMwcJpjntg==It/QzJQUEP9lwCSFBJq7/w==tEg=",
      "estabelecimento": "k5kFkX"
    },
    {
      "id": "ctxFCt15QEJ19DbZp0KLhg==bRc7Xodom5YN37C6xFwU5Q==vjI=",
      "nome": "Café",
      "preco": 2.55,
      "quantidade": 500,
      "estabelecimentoId": "638GGuKrN1LoQSXZuD8PHQ==0lETDvZ2/gfofp7dmOicOg==OHk=",
      "estabelecimento": "k5kFkX"
    },
    {
      "id": "zqxS0zfEM+HJaQFMiEbeYg==uO6Mso8MJJOJX3FWV0vYAQ==u7U=",
      "nome": "Suco de laranja",
      "preco": 3.5,
      "quantidade": 300,
      "estabelecimentoId": "hQOAJSW7TxPvu+cFtBDjxw==58dELbG+Cn0IRvNJ1jgPEA==9rc=",
      "estabelecimento": "bBgBcV"
    }
  ],
  "total": 3
}
```

### Pedido
#### Gerar pedido

```http
POST /api/v1/pedido HTTP/1.1
Host: localhost:3333
Content-Type: application/json
Accept: application/json
Content-Length: 547

 {
 	"carrinho": [
 		{
 			"produtoId": "Kuv7EA7ZPrKvbJTuOi3aQg==o5bXXsj66mDvhLJHrms0lQ==6Q==",
 			"quantidade": 10
 		},
 		{
 			"produtoId": "vwHIyiXtbJykNBePvBmcJA==VvOmoGz+sqNB3qXTF18qMA==lg==",
 			"quantidade": 1
 		}
 	],
 	"pagamento": {
 		"numero_cartao": "4111111111111111",
 		"cvv": "132",
 		"data_expiracao":"0922",
 		"nome": "Morpheus Fishburne"
 	},
 	"envio": {
 		"nome": "Neo Reeves",
 		"endereco": {
 			"estado": "sp",
 			"cidade": "Cotia",
 			"bairro": "Rio Cotia",
 			"rua": "Rua Matrix",
 			"numero": "9999",
 			"cep": "06714360"
 		}
 	}
 }
```

#### Pedido feito com sucesso

```http
HTTP/1.1 200 OK

{
  "mensagem": "pedido realizado",
  "pedidoId": "l8GGJNcaUUxqFjcT9/qpTw==SokF2nCDsTtuEj12I3a/sw==SUvqylsodHs="
}
```
