# Arquitetura – PetEncontrado V2

## Visão

Arquitetura cliente-servidor em monorepo:

```text
Next.js / React / TypeScript
          |
          | HTTPS + JSON / multipart
          v
NestJS / REST / Swagger
          |
          | Prisma ORM
          v
PostgreSQL
```

## Decisões

- **Next.js + TypeScript:** interface responsiva, componentização e rotas organizadas.
- **NestJS + TypeScript:** módulos, DTOs, guards, pipes e documentação OpenAPI.
- **PostgreSQL + Prisma:** banco relacional, migrations, índices e acesso tipado.
- **JWT:** access token curto; refresh token revogável em cookie HttpOnly.
- **RBAC:** perfis USER e ADMIN.
- **Docker:** ambiente reproduzível.
- **Playwright/Jest:** testes E2E e unitários.

## Segurança

- bcrypt (12 rounds) para senhas.
- Access token de 15 minutos.
- Refresh token armazenado como hash no banco.
- Refresh cookie HttpOnly, SameSite e Secure em produção.
- ValidationPipe com whitelist e rejeição de campos desconhecidos.
- Rate limiting, CORS restrito e Helmet.
- Autorização por papel e por proprietário do anúncio.
- Upload limitado a JPG/PNG/WEBP e 5 MB.
- Logs de auditoria para ações administrativas.
- Segredos somente em variáveis de ambiente.
