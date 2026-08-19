# 🐾 PetEncontrado V2

Sistema web completo para cadastro e busca de animais perdidos e encontrados. A V2 foi estruturada como projeto acadêmico profissional, com front-end moderno, API REST, banco relacional, autenticação, autorização, segurança, testes e documentação.

## Tecnologias

- **Front-end:** Next.js, React, TypeScript, Tailwind CSS
- **Back-end:** NestJS, TypeScript, Swagger/OpenAPI
- **Banco:** PostgreSQL + Prisma ORM
- **Segurança:** bcrypt, JWT access/refresh, cookie HttpOnly, RBAC, ValidationPipe, Helmet, CORS, rate limiting
- **Testes:** Jest + Playwright
- **Infra:** Docker / Docker Compose

## Funcionalidades

- Cadastro, login, refresh e logout
- Recuperação de senha com token temporário
- Usuário comum e administrador
- Cadastro de animais perdidos/encontrados
- Upload de até 5 fotos
- Pesquisa e filtros
- Detalhes do animal
- WhatsApp do responsável
- Registro de avistamento
- Minha Conta / Meus Anúncios
- Marcar como reunido ou encerrar anúncio
- Dashboard administrativo
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
