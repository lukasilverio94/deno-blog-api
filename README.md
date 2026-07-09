# Deno Blog API

API CRUD em Deno com Express, MongoDB, Mongoose, JWT, utilizando arquitetura em camadas e respostas padronizadas com `responser`/`throwlhos`.

## Requisitos

- Deno instalado
- MongoDB disponível
- Para transações MongoDB, use MongoDB Atlas ou uma instância local configurada como replica set.

  Ler mais sobre em uma pergunta no MongoDB Community:
  - https://www.mongodb.com/community/forums/t/why-replica-set-is-mandatory-for-transactions-in-mongodb/9533

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
deno test
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

`POST /api/register`

```json
{
    "username": "lucas",
    "bio": "this is a test bio", 
    "avatar": "this is a test avatar",
    "password": "test123"
}
```

Response : 
```json
{
    "status": "CREATED",
    "code": 201,
    "success": true,
    "message": "Registered sucessfuly",
    "data": {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTRlOTg4OTE5MTNhYjQ3YjM0NmVhZjYiLCJpYXQiOjE3ODM1MzU3NTMsImV4cCI6MTc4MzU1MDE1M30.GAFwSOjyQvbp5iW5X4vkPFN17gXNqShb9zpoWqgA80OpDvwqi-KlzV0ftwS-o3rOcxRFsijleDGhVPArY-lwdg"
    }
}
```
Response Error missing fields:
```json
{
    "status": "UNPROCESSABLE_ENTITY",
    "code": 422,
    "success": false,
    "message": "Fields username invalids (1)",
    "errors": [
        {
            "field": "username",
            "message": "Field is required"
        }
    ]
}
```

`POST /api/login`

```json
{
  "username": "lucas",
  "password": "test123"
}
```

Response:
```json
{
    "status": "OK",
    "code": 200,
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTRlOTg4OTE5MTNhYjQ3YjM0NmVhZjYiLCJpYXQiOjE3ODM1MzU3OTQsImV4cCI6MTc4MzU1MDE5NH0.Z5nTskwqYj1WdK0p46cutLfDJpbGIuSUKS3JdfW7Kx1D_ARrB43WPE8ndfJZjk_P-nPZV_Sody4lR-VJ_6iyBg",
        "user": {
            "userId": "6a4e98891913ab47b346eaf6",
            "username": "lucas"
        }
    }
}
```

Response Invalid Login:
```json
{
    "status": "UNAUTHORIZED",
    "code": 401,
    "success": false,
    "message": "Invalid credentials"
}
```

### Users

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

Exemplo de GET:
`GET /api/users`

```json
{
    "status": "OK",
    "code": 200,
    "success": true,
    "message": "All users found",
    "data": {
        "users": [
            {
                "_id": "6a4e98891913ab47b346eaf6",
                "username": "lucas",
                "bio": "this is a test bio",
                "avatar": "this is a test avatar",
                "createdAt": "2026-07-08T18:35:53.884Z",
                "updatedAt": "2026-07-08T18:35:53.884Z",
                "__v": 0
            },
            {
                "_id": "6a4e935fe6e466b5a9f78b68",
                "username": "Emanuela",
                "bio": "t",
                "avatar": "this is a test avatar",
                "createdAt": "2026-07-08T18:13:51.620Z",
                "updatedAt": "2026-07-08T18:13:51.620Z",
                "__v": 0
            },
            {
                "_id": "6a4e7b6599fb48e68a989b4c",
                "username": "John",
                "bio": "this is a test bio",
                "avatar": "this is a test avatar",
                "createdAt": "2026-07-08T16:31:33.021Z",
                "updatedAt": "2026-07-08T16:31:33.021Z",
                "__v": 0
            }
        ]
    }
}
```

Not Found Response:
```json
{
    "status": "NOT_FOUND",
    "code": 404,
    "success": false,
    "message": "User not found",
    "errors": {
        "userId": "6a4d8fc5ead56b9b4785dcee"
    }
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

Response:
```json
{
    "status": "OK",
    "code": 200,
    "success": true,
    "message": "Post created successfully",
    "data": {
        "post": {
            "title": "test post",
            "content": "This is my first valid blog post content.",
            "author": "6a4e98891913ab47b346eaf6",
            "published": true,
            "tags": [
                "deno",
                "api"
            ],
            "_id": "6a4e9a6b1913ab47b346eaf7",
            "createdAt": "2026-07-08T18:43:55.813Z",
            "updatedAt": "2026-07-08T18:43:55.813Z",
            "__v": 0
        }
    }
}
```

### Comments

- `POST /api/comments` protegido
- `POST /api/posts/:postId/comments` protegido
- `GET /api/comments`
- `GET /api/comments/:id`
- `GET /api/comments/post/:postId` protegido
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

```json
{
    "status": "CREATED",
    "code": 201,
    "success": true,
    "message": "Comment created",
    "data": {
        "comment": {
            "content": "Great post",
            "author": "6a4e4d6060e423a707e6eec0",
            "post": "6a4e4ee760e423a707e6eec2",
            "_id": "6a4e4f0960e423a707e6eec3",
            "createdAt": "2026-07-08T13:22:17.494Z",
            "updatedAt": "2026-07-08T13:22:17.494Z",
            "__v": 0
        }
    }
}
```

Porém nessa rota `POST /api/comments` se não passar o campo `postId`, como a seguir:

```json
{
    "content": "This is a invalid request."
}
```

Response:

```json
{
    "status": "BAD_REQUEST",
    "code": 400,
    "success": false,
    "message": "Post id is required to create a comment"
}
```

## Transaction

A criação de comentário executa uma operação atômica:

1. Cria o documento `Comment`.
2. Adiciona o id do comentário no array `comments` do `Post`.

Se uma das operações falhar, a transação é abortada.

## Documentação Publicada

A documentação da API está disponível no Postman:

- [Postman Docs](https://documenter.getpostman.com/view/56388802/2sBY4LQgdj)