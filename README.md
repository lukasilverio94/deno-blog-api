# Deno Blog API

API CRUD em Deno com Express, MongoDB, Mongoose, JWT, utilizando arquitetura em camadas e respostas padronizadas com `responser`/`throwlhos`.

## Requisitos

- Deno instalado
- MongoDB disponível
- Para transações MongoDB, use MongoDB Atlas ou uma instância local configurada como replica set

## Configuração

Crie o arquivo `.env` com base no `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/deno-blog-api
JWT_SECRET=your_secret
EXPIRES_IN=1h
```

## Executar

```bash
deno task dev
```

## Testes

```bash
deno task test
```

## Autenticação

Faça login em `POST /api/login` e salve o token retornado no Postman em uma variável de ambiente chamada `auth_token`.

Script no Postman, aba `Tests` da rota de login:

```js
if (pm.response.code === 200) {
  const response = pm.response.json();

  if (response.data?.token) {
    pm.environment.set("auth_token", response.data.token);
  }
}
```

Use nas rotas protegidas:

```txt
Authorization: Bearer {{auth_token}}
```

## Endpoints

### Auth

`POST /api/login`

```json
{
  "username": "lucas",
  "password": "test123"
}
```

### Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id` protegido
- `DELETE /api/users/:id` protegido

Exemplo de criação:

```json
{
  "username": "lucas",
  "password": "test123",
  "bio": "Backend intern",
  "avatar": "https://example.com/avatar.png"
}
```

### Posts

- `POST /api/posts` protegido
- `GET /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id` protegido
- `DELETE /api/posts/:id` protegido

Ao criar um post, o `author` vem do JWT. Não envie `author` no body.

Exemplo:

```json
{
  "title": "First post",
  "content": "This is my first valid blog post content.",
  "published": true,
  "tags": ["deno", "api"]
}
```

### Comments

- `POST /api/comments` protegido
- `POST /api/posts/:postId/comments` protegido
- `GET /api/comments`
- `GET /api/comments/:id`
- `PATCH /api/comments/:id` protegido
- `DELETE /api/comments/:id` protegido

Ao criar um comentário, o `author` vem do JWT. Preferencialmente use a rota com `postId` na URL:

```txt
POST /api/posts/:postId/comments
```

Body:

```json
{
  "content": "Great post."
}
```

Também é possível usar `POST /api/comments` enviando o post(id) no body:

```json
{
  "postId": "post_id",
  "content": "Great post"
}
```

## Transação

A criação de comentário executa uma operação atômica:

1. Cria o documento `Comment`.
2. Adiciona o id do comentário no array `comments` do `Post`.

Se uma das operações falhar, a transação é abortada.

## Documentação Publicada

Publique a collection do Postman e adicione o link aqui:

```txt
Postman docs: Em construção...
```
