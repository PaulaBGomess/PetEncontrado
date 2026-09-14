# 🐾 PetEncontrado V2

Sistema web completo para cadastro e busca de animais perdidos e encontrados. A V2 foi estruturada como projeto acadêmico profissional, com front-end moderno, API REST, banco relacional, autenticação, autorização, segurança, testes e documentação.

## Tecnologias

- **Front-end:** Next.js, React, TypeScript, Tailwind CSS
- **Back-end:** NestJS, TypeScript, Swagger/OpenAPI
- **Banco:** PostgreSQL + Prisma ORM
- **Segurança:** bcrypt, JWT access/refresh, cookie HttpOnly, RBAC, ValidationPipe, Helmet, CORS, rate limiting
- **Testes:** Jest + Playwright
- **Infra:** Docker / Docker Compose
- **Mapas:** OpenStreetMap
- **Autenticação social:** Google OAuth 2.0 e Facebook Login

## Funcionalidades

- Cadastro, login, refresh e logout
- Login social com Google e Facebook
- Vinculação de conta social por e-mail
- Recuperação de senha com token temporário
- Usuário comum e administrador
- Cadastro de animais perdidos/encontrados
- Localização por latitude/longitude com visualização no OpenStreetMap
- Upload de até 5 fotos
- Pesquisa e filtros
- Detalhes do animal
- WhatsApp do responsável
- Registro de avistamento
- Minha Conta / Meus Anúncios
- Marcar como reunido ou encerrar anúncio
- Dashboard administrativo
- Gerenciamento de perfis USER/ADMIN
- Bloqueio/desbloqueio de usuários
- Logs de auditoria
- Swagger
- Seed de demonstração

## Início rápido – ambiente local

### 1. Pré-requisitos

- Node.js 22+
- npm
- Docker Desktop ou PostgreSQL local

### 2. Configurar variáveis

```bash
cp .env.example .env
```

Troque **JWT_ACCESS_SECRET** e **JWT_REFRESH_SECRET** por duas chaves diferentes e fortes.

### 3. Subir somente o PostgreSQL

```bash
docker compose up -d db
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Gerar Prisma, aplicar migration e seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 6. Executar

Em dois terminais:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Acessos:

- Front-end: `http://localhost:3000`
- API: `http://localhost:3333/api/v1`
- Swagger: `http://localhost:3333/docs`

## Login social

O projeto possui fluxo de autenticação social para Google e Facebook. As credenciais dos provedores não devem ser versionadas no GitHub; configure-as somente no arquivo `.env` local ou no ambiente de produção.

### Google

Crie um cliente OAuth 2.0 no Google Cloud Console e cadastre como URI de redirecionamento autorizada:

```text
http://localhost:3333/api/v1/auth/google/callback
```

Depois preencha no `.env`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3333/api/v1/auth/google/callback
```

O fluxo solicita apenas os escopos `openid`, `email` e `profile`, suficientes para identificar o usuário e obter nome, e-mail e imagem de perfil autorizados pela conta.

### Facebook

Crie um aplicativo no Meta for Developers com Facebook Login e cadastre como URI OAuth válida:

```text
http://localhost:3333/api/v1/auth/facebook/callback
```

Depois preencha no `.env`:

```env
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_GRAPH_VERSION=v23.0
FACEBOOK_CALLBACK_URL=http://localhost:3333/api/v1/auth/facebook/callback
```

A conta Facebook deve disponibilizar um e-mail para que o PetEncontrado consiga identificar ou criar o usuário.

> Login social não concede acesso à caixa de entrada do Gmail ou às mensagens do Facebook. O sistema usa apenas os dados de perfil autorizados pelo usuário durante o login.

## Usuários de demonstração

Após o seed:

- Administrador: `admin@petencontrado.local` / `Admin@123456`
- Usuário: `paula@exemplo.com` / `Usuario@123456`

**Troque essas senhas se publicar o sistema.**

## Docker completo

Configure `.env` e execute:

```bash
npm install
npm run db:generate
docker compose up -d --build
```

> Para avaliação acadêmica, o modo local (DB no Docker + API/Web em modo dev) é mais simples para visualizar logs e alterações.

## Testes

```bash
npm test
npm run test:e2e
```

## Documentação

- `docs/ARCHITECTURE.md`
- `docs/REQUIREMENTS.md`
- `docs/SECURITY.md`
- `docs/SPRINTS.md`
- Documento completo em DOCX incluído na raiz do pacote final.

## Observações de produção

O projeto está completo para desenvolvimento, apresentação e evolução acadêmica. Para um ambiente público real, ainda é necessário configurar domínio/HTTPS, armazenamento externo de imagens, serviço de e-mail transacional, backup, monitoramento e política LGPD/privacidade adequada à instituição responsável.
