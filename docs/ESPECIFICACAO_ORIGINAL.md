# Sistema de Animais Perdidos e Encontrados

## 1. Nome do sistema

**PetEncontrado – Sistema de Animais Perdidos e Encontrados**

## 2. Objetivo

O sistema terá como objetivo ajudar pessoas a localizar animais perdidos e facilitar o encontro entre tutores e pessoas que encontraram animais nas ruas.

A plataforma permitirá cadastrar animais perdidos, animais encontrados, visualizar ocorrências próximas e entrar em contato com os responsáveis pelo cadastro.

---

# 3. Tipos de usuários

O sistema terá dois tipos principais de usuários:

### Usuário comum

Poderá:

- Criar uma conta;
- Fazer login;
- Cadastrar animal perdido;
- Cadastrar animal encontrado;
- Pesquisar animais;
- Visualizar detalhes das ocorrências;
- Entrar em contato com quem realizou o cadastro;
- Editar seus próprios anúncios;
- Informar que o animal foi encontrado;
- Excluir seus próprios anúncios.

### Administrador

Poderá:

- Acessar painel administrativo;
- Visualizar todos os usuários;
- Visualizar todos os anúncios;
- Editar anúncios;
- Remover anúncios inadequados;
- Bloquear usuários;
- Visualizar estatísticas do sistema.

---

# 4. Tela inicial

A página inicial deverá apresentar:

**Logo do sistema**

PetEncontrado 🐾

**Menu**

- Início
- Animais Perdidos
- Animais Encontrados
- Cadastrar Ocorrência
- Como Funciona
- Entrar
- Criar Conta

Também deverá apresentar dois botões principais:

### PERDI MEU ANIMAL

Ao clicar, o usuário será direcionado para o cadastro de animal perdido.

### ENCONTREI UM ANIMAL

Ao clicar, o usuário será direcionado para o cadastro de animal encontrado.

---

# 5. Cadastro de usuário

Campos:

- Nome completo
- E-mail
- Telefone
- WhatsApp
- Cidade
- Estado
- Senha
- Confirmar senha

Botão:

**CRIAR CONTA**

Após o cadastro:

> Conta criada com sucesso!

---

# 6. Login

Campos:

- E-mail
- Senha

Botões:

- Entrar
- Esqueci minha senha
- Criar conta

Ao realizar o login corretamente:

> Bem-vindo ao PetEncontrado!

---

# 7. Cadastro de animal perdido

Título da tela:

## Cadastrar Animal Perdido

Campos:

### Nome do animal

Exemplo:

> Thor

### Tipo de animal

Opções:

- Cachorro
- Gato
- Pássaro
- Outros

### Raça

Exemplo:

> Shih-tzu

### Sexo

- Macho
- Fêmea
- Não identificado

### Porte

- Pequeno
- Médio
- Grande

### Cor

Exemplo:

> Branco com manchas marrons

### Idade aproximada

Exemplo:

> 4 anos

### Data do desaparecimento

Exemplo:

> 15/08/2026

### Local onde foi visto pela última vez

Campos:

- Rua
- Bairro
- Cidade
- Estado
- Ponto de referência

### Descrição

Exemplo:

> Thor desapareceu próximo à praça central. Estava usando uma coleira azul e é bastante dócil.

### Características especiais

Exemplo:

> Possui uma mancha preta próxima ao olho direito.

### Foto

O usuário poderá adicionar uma ou mais fotos do animal.

### Contato

- Nome do responsável
- Telefone
- WhatsApp
- E-mail

Botão:

**PUBLICAR ANIMAL PERDIDO**

Mensagem:

> Cadastro publicado com sucesso!

---

# 8. Cadastro de animal encontrado

Título:

## Encontrei um Animal

Campos:

- Tipo de animal
- Raça aproximada
- Sexo
- Porte
- Cor
- Data em que foi encontrado
- Local onde foi encontrado
- Cidade
- Bairro
- Descrição
- Características
- Fotos
- Nome da pessoa que encontrou
- Telefone
- WhatsApp

Pergunta:

### O animal está com você?

Opções:

- Sim
- Não
- Foi encaminhado para uma ONG
- Foi encaminhado para uma clínica veterinária

Botão:

**PUBLICAR ANIMAL ENCONTRADO**

---

# 9. Página de animais perdidos

Título:

## Animais Perdidos

Mostrar os animais em formato de cards.

Exemplo:

**🐶 THOR**

Cachorro
Shih-tzu
Macho

📍 Centro – Palmas/TO

📅 Desapareceu em 15/08/2026

**Status: PERDIDO**

Botão:

**VER DETALHES**

---

# 10. Página de animais encontrados

Título:

## Animais Encontrados

Exemplo:

**🐱 GATO ENCONTRADO**

Gato
Fêmea
Cor branca

📍 Plano Diretor Sul – Palmas/TO

📅 Encontrado em 16/08/2026

**Status: ENCONTRADO**

Botão:

**VER DETALHES**

---

# 11. Sistema de pesquisa

A plataforma deverá possuir uma barra:

> 🔎 Pesquisar animal

Filtros:

- Cachorro
- Gato
- Outros
- Cidade
- Bairro
- Raça
- Sexo
- Porte
- Cor
- Perdido
- Encontrado

Exemplo:

Usuário seleciona:

**Tipo:** Cachorro
**Cidade:** Palmas
**Cor:** Branco

O sistema exibirá todos os registros compatíveis.

---

# 12. Detalhes do animal

Ao clicar em um anúncio:

## Thor está perdido!

Exibir:

- Fotos
- Nome
- Espécie
- Raça
- Sexo
- Porte
- Cor
- Idade
- Data do desaparecimento
- Local
- Características
- Descrição

### Último local onde foi visto

Apresentar endereço e, futuramente, integração com mapa.

### Contato

Nome:

> Paula

Telefone:

> (63) XXXXX-XXXX

Botão:

**CHAMAR NO WHATSAPP**

Outro botão:

**EU VI ESTE ANIMAL**

---

# 13. Botão "Eu vi este animal"

Quando alguém encontrar ou visualizar um animal cadastrado como perdido, poderá clicar:

**EU VI ESTE ANIMAL**

Abrirá um formulário:

### Onde você viu o animal?

- Cidade
- Bairro
- Rua
- Ponto de referência

### Quando?

- Data
- Horário aproximado

### Observação

Exemplo:

> Vi um cachorro muito parecido próximo ao supermercado.

### Foto

Opcional.

Botão:

**ENVIAR INFORMAÇÃO**

O tutor receberá a informação.

---

# 14. Animal localizado

O proprietário poderá acessar seu anúncio e clicar:

**MEU ANIMAL FOI ENCONTRADO**

O sistema perguntará:

> Confirma que Thor foi encontrado?

Botões:

**SIM, FOI ENCONTRADO**

**CANCELAR**

Depois:

### Status

✅ ANIMAL ENCONTRADO

O anúncio continuará disponível no histórico, porém não aparecerá entre os animais atualmente perdidos.

---

# 15. Área do usuário

Menu:

## Minha Conta

Mostrar:

- Meu perfil
- Meus animais perdidos
- Animais que encontrei
- Avisos recebidos
- Editar perfil
- Alterar senha
- Sair

---

# 16. Meus anúncios

Exemplo:

## Meus Animais

### Thor

Status:

🔴 Perdido

Data:

15/08/2026

Botões:

- Visualizar
- Editar
- Marcar como encontrado
- Excluir

---

# 17. Painel administrativo

Dashboard:

## Administração PetEncontrado

Indicadores:

**Usuários cadastrados**

1.254

**Animais perdidos**

187

**Animais encontrados**

98

**Animais que voltaram para casa**

354

**Novos anúncios hoje**

27

---

# 18. Administração de usuários

Tabela:

| NomeE-mailCidadeData CadastroStatus |                                          |        |            |       |
| ----------------------------------- | ---------------------------------------- | ------ | ---------- | ----- |
| João Silva                          | [joao@email.com](mailto\:joao@email.com) | Palmas | 15/08/2026 | Ativo |

Ações:

- Visualizar
- Editar
- Bloquear
- Excluir

---

# 19. Administração de anúncios

Tabela:

| AnimalTipoCidadeSituaçãoData |          |        |         |            |
| ---------------------------- | -------- | ------ | ------- | ---------- |
| Thor                         | Cachorro | Palmas | Perdido | 15/08/2026 |

Ações:

- Visualizar
- Editar
- Excluir
- Alterar status

---

# 20. Banco de dados

O sistema poderá utilizar as seguintes tabelas.

## usuarios

- id\_usuario
- nome
- email
- telefone
- whatsapp
- cidade
- estado
- senha
- tipo\_usuario
- status
- data\_cadastro

## animais

- id\_animal
- id\_usuario
- nome
- tipo
- raca
- sexo
- porte
- cor
- idade
- descricao
- caracteristicas
- foto
- situacao
- data\_ocorrencia
- data\_cadastro

## localizacoes

- id\_localizacao
- id\_animal
- rua
- bairro
- cidade
- estado
- ponto\_referencia
- latitude
- longitude

## avistamentos

- id\_avistamento
- id\_animal
- id\_usuario
- data
- horario
- cidade
- bairro
- local
- descricao
- foto

## contatos

- id\_contato
- id\_animal
- nome
- telefone
- whatsapp
- email

---

# 21. Status dos animais

O sistema poderá utilizar:

🔴 **PERDIDO**

🟠 **ENCONTRADO SEM TUTOR IDENTIFICADO**

🟢 **REUNIDO COM O TUTOR**

⚪ **ANÚNCIO ENCERRADO**

---

# 22. Funcionalidades futuras

Após a primeira versão estar funcionando, poderão ser adicionados:

- Mapa com localização dos animais;
- Geolocalização;
- Notificação por e-mail;
- Notificação por WhatsApp;
- Compartilhamento em redes sociais;
- QR Code para cada animal;
- Cadastro de ONGs;
- Cadastro de clínicas veterinárias;
- Cadastro de abrigos;
- Sistema de adoção;
- Reconhecimento de animais através de imagem;
- Comparação automática entre animal perdido e encontrado;
- Inteligência Artificial;
- Sistema de denúncias;
- Aplicativo para celular.

---

# 23. Inteligência Artificial

Uma funcionalidade interessante seria:

### Encontrar possíveis correspondências

Quando alguém cadastrar:

> Cachorro perdido, macho, porte pequeno, branco, Shih-tzu.

O sistema pesquisará automaticamente animais encontrados com características semelhantes.

Resultado:

> Encontramos 3 animais que podem ser o seu.

**92% de compatibilidade**

Cachorro encontrado no Centro de Palmas.

**78% de compatibilidade**

Cachorro encontrado no Plano Diretor Sul.

Assim, o tutor poderá comparar as fotos.

---

# 24. Tecnologias sugeridas

Para uma primeira versão:

### Front-end

- HTML
- CSS
- JavaScript
- Bootstrap

### Back-end

Uma boa opção:

- Node.js
- Express

ou:

- Python
- Flask

### Banco de dados

- PostgreSQL

ou, para uma versão inicial:

- MySQL

### Hospedagem

Poderá ser posteriormente publicado em um servidor web para que qualquer pessoa consiga acessar pelo celular ou computador.

---

# 25. Estrutura do projeto

```
pet-encontrado/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── animais-perdidos.html
│   ├── animais-encontrados.html
│   ├── cadastrar-animal.html
│   ├── animal.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   └── images/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── server.js
│   │
│   └── package.json
│
├── database/
│   └── database.sql
│
└── README.md

```

# 26. Fluxo principal do sistema

```
USUÁRIO ACESSA O SITE
        ↓
ESCOLHE UMA OPÇÃO
        ↓
PERDI UM ANIMAL
OU
ENCONTREI UM ANIMAL
        ↓
FAZ LOGIN / CADASTRO
        ↓
PREENCHE OS DADOS DO ANIMAL
        ↓
ADICIONA FOTO
        ↓
INFORMA LOCALIZAÇÃO
        ↓
PUBLICA O ANÚNCIO
        ↓
ANÚNCIO APARECE PARA OUTROS USUÁRIOS
        ↓
OUTRA PESSOA IDENTIFICA O ANIMAL
        ↓
ENTRA EM CONTATO COM O TUTOR
        ↓
ANIMAL É LOCALIZADO
        ↓
TUTOR ALTERA STATUS
        ↓
✅ ANIMAL ENCONTRADO

```

# 27. Resultado esperado

O **PetEncontrado** deverá ser uma plataforma simples, intuitiva e responsiva, funcionando tanto em computador quanto em celular.

O foco principal será permitir que uma pessoa cadastre rapidamente um animal perdido ou encontrado e que outros usuários consigam pesquisar ocorrências semelhantes, aumentando as chances de o animal retornar para sua família.