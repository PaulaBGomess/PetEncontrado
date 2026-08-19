# Checklist de Segurança

- [x] Senhas com bcrypt.
- [x] JWT de acesso com expiração curta.
- [x] Refresh token revogável, persistido somente como hash.
- [x] Cookie HttpOnly para refresh token.
- [x] RBAC USER/ADMIN.
- [x] Verificação de propriedade do anúncio.
- [x] ValidationPipe whitelist + forbidNonWhitelisted.
- [x] Rate limiting global e mais rígido em login/registro/recuperação.
- [x] Helmet.
- [x] CORS restrito ao front-end configurado.
- [x] Prisma para reduzir SQL Injection.
- [x] Upload com MIME permitido e tamanho máximo.
- [x] Segredos fora do Git.
- [x] Logs de auditoria administrativos.
- [ ] HTTPS/TLS no servidor de produção (depende da hospedagem).
- [ ] Antivírus/scan de imagem em produção (recomendado para escala real).
- [ ] Serviço real de e-mail para recuperação de senha (integração de produção).
