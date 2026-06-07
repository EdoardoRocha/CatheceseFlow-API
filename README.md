# CatheceseFlow API

O **CatheceseFlow API** é uma solução de backend robusta e estruturada desenvolvida em Node.js com o ecossistema Express e Sequelize ORM. O sistema foi projetado especificamente para simplificar e automatizar o ecossistema de gestão paroquial de catequeses, abrangendo o controle completo de paróquias, turmas, usuários (administradores, coordenadores e catequistas), alunos, encontros (formações), além do rastreamento detalhado de chamadas (presenças e faltas justificadas).

---

## 🚀 Tecnologias Utilizadas

A API foi construída utilizando práticas modernas de desenvolvimento back-end em JavaScript (ES Modules):

- **Node.js**: Ambiente de execução.
- **Express (v5.2.1)**: Framework web dinâmico para gerenciamento de rotas e middlewares.
- **Sequelize (v6.37.8)**: ORM (Object-Relational Mapping) para abstração e manipulação do banco de dados.
- **PostgreSQL / pg (v8.20.0)**: Banco de dados relacional robusto focado em integridade.
- **JSON Web Token (v9.0.3)**: Implementação de autenticação e autorização stateless baseada em papéis (RBAC).
- **BcryptJS (v3.0.3)**: Criptografia forte e hashing seguro para salvamento de senhas de usuários.
- **Cross-Env & Nodemon**: Ferramentas complementares para ambiente de desenvolvimento ágil e isolamento de variáveis.

---

## 📂 Estrutura Arquitetural do Projeto

O projeto adota uma arquitetura em camadas clara e extensível, inspirada no padrão MVC (sem a camada de View), facilitando a manutenção e a escalabilidade segura da regra de negócio:


```

```text
README.md gerado com sucesso!

```text
├── CatheceseFlow-API/
│   ├── index.js                     # Ponto de entrada (Bootstrap da aplicação Express)
│   ├── seed.js                      # Script para semear dados iniciais no Banco de Dados
│   ├── package.json                 # Definição de dependências e scripts npm
│   └── src/
│       ├── Config/
│       │   └── db.js                # Instanciação da conexão Sequelize com o PostgreSQL
│       ├── Controllers/             # Controladores responsáveis por interceptar requisições e responder
│       ├── Helpers/                 # Funções auxiliares (emissão de tokens JWT, extração de headers)
│       ├── Middlewares/             # Filtros de validação de payload, autenticação e nível de acesso
│       ├── Models/                  # Mapeamento de tabelas e definição de relacionamentos relacionais
│       └── Routes/                  # Segmentação e exposição dos endpoints HTTP

```

---

## 🛠️ Configuração e Instalação

### 1. Pré-requisitos

Certifique-se de possuir o **Node.js** (versão LTS recomendada) e um servidor **PostgreSQL** ativo em sua máquina ou em nuvem.

### 2. Clonar e Instalar Dependências

```bash
# Clone o repositório
git clone [https://github.com/EdoardoRocha/CatheceseFlow-API.git](https://github.com/EdoardoRocha/CatheceseFlow-API.git)

# Acesse o diretório
cd CatheceseFlow-API

# Instale todas as dependências declaradas
npm install

```

### 3. Variáveis de Ambiente (`.env`)

Crie um arquivo chamado `.env` na raiz do projeto e configure as chaves a seguir conforme a sua infraestrutura:

```env
PORT=3000
AUTH_SECRET=seu_segredo_jwt_super_seguro_aqui

# Opção 1: String de conexão direta (ideal para ambientes como AWS Render/Heroku/Supabase)
DATABASE_URL=postgres://usuario:senha@host:port/banco_de_dados

# Opção 2: Configuração por parâmetros separados (usada caso DATABASE_URL não esteja definida)
DB_HOST=127.0.0.1
DB_NAME=catheceseflow_db
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres

```

### 4. Scripts Disponíveis

* **Executar em modo de Desenvolvimento (com recarregamento automático):**
```bash
npm run dev

```


* **Executar a Carga Inicial de Dados (Seeds para Paróquias Padrão):**
```bash
npm run seed

```


* **Executar em Ambiente de Produção (via Gerenciador de Processos PM2):**
```bash
npm run start

```



---

## 🗄️ Modelagem de Dados e Associações (Sequelize)

A integridade referencial e os relacionamentos do sistema estão consolidados no arquivo centralizado de associações (`src/Models/associations.js`). A listagem a seguir sumariza a topologia relacional do banco de dados:

1. **Paróquias e Usuários / Turmas**:
* Uma Paróquia (`Parishes`) possui muitos Usuários (`Users`) e muitas Turmas (`Class`).
* Um Usuário e uma Turma pertencem obrigatoriamente a uma única Paróquia (`ParishId`).


2. **Usuários (Catequistas) e Encontros (Formações)**:
* Relacionamento de Muitos para Muitos ($N:M$) gerenciado pela tabela intermediária `teacher_lectures`. Um encontro pode ser ministrado por vários catequistas e um catequista pode ministrar múltiplos encontros.


3. **Alunos e Endereços**:
* Um Aluno (`Students`) possui um Endereço (`Address`). Um Endereço está associado de forma única e exclusiva a um Aluno (`AddressId`).


4. **Turmas, Alunos e Encontros**:
* Uma Turma possui múltiplos Alunos cadastrados e engloba múltiplos Encontros agendados.
* Cada Aluno e cada Encontro pertence de forma estrita a uma única Turma (`ClassId`).


5. **Chamadas de Presença e Registro de Faltas**:
* Um registro de Presença (`Attendances`) ou Falta Justificada (`Absences`) associa bidirecionalmente um único Aluno (`StudentId`) a um determinado Encontro (`LectureId`).



---

## 🗺️ Documentação Detalhada das Rotas (End-points)

Todas as rotas da aplicação utilizam o prefixo base `/api/v1`.

### 🔐 Níveis de Permissão (Roles)

O sistema implementa Controle de Acesso Baseado em Funções (RBAC). Os cargos mapeados pela aplicação são:

* `Admin`: Controle irrestrito do ecossistema.
* `Coordenador`: Gestão de turmas, alunos e encontros dentro de sua jurisdição paroquial.
* `Catequista`: Operações focadas em turmas, diário de classe, faltas e presenças.

---

### 1. Módulo de Usuários e Autenticação (`/api/v1/users`)

#### **Criar um Novo Usuário (Registro)**

* **Método**: `POST`
* **Rota**: `/register`
* **Autenticação**: Pública (As validações internas ocorrem via middleware).
* **Payload Esperado (JSON)**:

```json
{
  "name": "João da Silva",
  "email": "joao@paroquia.com",
  "password": "SenhaSegura123",
  "confirmPassword": "SenhaSegura123",
  "role": "Catequista", 
  "ParishId": 1
}

```

* **Regras de Validação**:
* Todos os campos são de preenchimento obrigatório.
* `password` e `confirmPassword` devem coincidir obrigatoriamente.
* O e-mail informado deve ser exclusivo (não cadastrado).
* O `ParishId` deve referenciar uma paróquia real existente na base de dados.
* Campos de texto não podem estender o limite técnico de 100 caracteres.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "message": "Usuário criado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 4
}

```

#### **Autenticação de Usuário (Login)**

* **Método**: `POST`
* **Rota**: `/login`
* **Autenticação**: Pública.
* **Payload Esperado (JSON)**:

```json
{
  "email": "joao@paroquia.com",
  "password": "SenhaSegura123"
}

```

* **Regras de Validação**:
* `email` e `password` são obrigatórios e validados estruturalmente.
* Validação criptográfica do hash da senha cadastrada versus a digitada.


* **Resposta de Sucesso (200 OK)**:

```json
{
  "message": "Você está logado",
  "toke": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "João da Silva",
    "email": "joao@paroquia.com",
    "role": "Catequista",
    "ParishId": 1,
    "createdAt": "2026-05-16T20:00:00.000Z",
    "updatedAt": "2026-05-16T20:00:00.000Z"
  }
}

```

---

### 2. Módulo de Turmas (`/api/v1/classes`)

#### **Criar uma Nova Turma**

* **Método**: `POST`
* **Rota**: `/create`
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Payload Esperado (JSON)**:

```json
{
  "type": "Crisma",
  "location": "Sala São Pascoal - Bloco B",
  "day": "Sabado",
  "start": "14:00:00",
  "end": "16:00:00"
}

```

* **Regras de Validação**:
* `type` aceita estritamente: `'Primeira Comunhão'`, `'Perseverança'` ou `'Crisma'`.
* `day` aceita estritamente: `'Segunda'`, `'Terça'`, `'Quarta'`, `'Quinta'`, `'Sexta'` ou `'Sabado'`.
* `location`, `start` e `end` são obrigatórios.
* O usuário só possui permissão para instanciar turmas destinadas à sua própria Paróquia vinculada no token.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "message": "Turma criada com sucesso",
  "classId": {
    "id": 2,
    "type": "Crisma",
    "location": "Sala São Pascoal - Bloco B",
    "day": "Sabado",
    "start": "14:00:00",
    "end": "16:00:00",
    "ParishId": 1,
    "updatedAt": "2026-05-16T23:10:00.000Z",
    "createdAt": "2026-05-16T23:10:00.000Z"
  }
}

```

#### **Listar Todas as Turmas da Minha Paróquia**

* **Método**: `GET`
* **Rota**: `/my-parish`
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Resposta de Sucesso (200 OK)**:

```json
[
  {
    "id": 2,
    "type": "Crisma",
    "location": "Sala São Pascoal - Bloco B",
    "day": "Sabado",
    "start": "14:00:00",
    "end": "16:00:00",
    "ParishId": 1
  }
]

```

---

### 3. Módulo de Alunos (`/api/v1/students`)

#### **Adicionar Novo Aluno a uma Turma**

* **Método**: `POST`
* **Rota**: `/create`
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Payload Esperado (JSON)**:

```json
{
  "name": "Carlos Eduardo Paz",
  "phones": [
    { "number": "85999998888", "label": "Mãe" },
    { "number": "85888887777", "label": "Aluno" }
  ],
  "cpf": "12345678901",
  "birth_date": "2015-03-12",
  "father_name": "João da Silva",
  "mother_name": "Maria da Silva",
  "road": "Rua das Flores",
  "house_number": 450,
  "code": "61760000",
  "city": "Cascavel",
  "neighborhood": "Centro",
  "classId": 2,
  "has_baptism": false,
  "has_first_communion": false
}

```

* **Regras de Validação**:
* Apenas `name` e `classId` são obrigatórios.
* `phones`, `cpf`, `birth_date`, `father_name`, `mother_name` e endereço são opcionais.
* `phones` é um array de objetos `{ number, label? }`, com no máximo 5 itens.
* O campo legado `phone` (string) ainda é aceito para compatibilidade; prefira `phones`.
* `birth_date`, quando enviado, deve estar no formato `AAAA-MM-DD`.
* Previne duplicidade: Se `cpf` for informado, não pode existir outro aluno com o mesmo `cpf` na mesma `classId`.
* A turma (`classId`) deve existir no sistema e pertencer à mesma paróquia do usuário que submete a requisição.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "message": "Estudante adicionado com sucesso!",
  "student": {
    "id": 12,
    "name": "Carlos Eduardo Paz",
    "phones": [
      { "id": 1, "number": "85999998888", "label": "Mãe" },
      { "id": 2, "number": "85888887777", "label": "Aluno" }
    ],
    "phone": "85999998888",
    "phoneSummary": "Mãe: 85999998888 · Aluno: 85888887777",
    "cpf": "12345678901",
    "birth_date": "2015-03-12",
    "father_name": "João da Silva",
    "mother_name": "Maria da Silva",
    "ClassId": 2,
    "AddressId": 5,
    "createdAt": "2026-05-16T23:15:00.000Z"
  }
}

```

#### **Buscar Todos os Alunos Pertencentes a uma Turma**

* **Método**: `GET`
* **Rota**: `/:classId` *(Ex: `/api/v1/students/2`)*
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Resposta de Sucesso (200 OK)**:

```json
[
  {
    "id": 12,
    "name": "Carlos Eduardo Paz",
    "phones": [
      { "id": 1, "number": "85999998888", "label": "Mãe" },
      { "id": 2, "number": "85888887777", "label": "Aluno" }
    ],
    "phone": "85999998888",
    "phoneSummary": "Mãe: 85999998888 · Aluno: 85888887777",
    "cpf": "12345678901",
    "birth_date": "2015-03-12",
    "father_name": "João da Silva",
    "mother_name": "Maria da Silva",
    "ClassId": 2,
    "AddressId": 5
  }
]

```

---

### 4. Módulo de Endereços (`/api/v1/addresses`)

#### **Obter Detalhes de um Endereço**

* **Método**: `GET`
* **Rota**: `/:addressId` *(Ex: `/api/v1/addresses/5`)*
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Resposta de Sucesso (200 OK)**:

```json
{
  "id": 5,
  "road": "Rua das Flores",
  "code": "61760000",
  "house_number": 450,
  "city": "Cascavel",
  "neighborhood": "Centro",
  "createdAt": "2026-05-16T23:15:00.000Z",
  "updatedAt": "2026-05-16T23:15:00.000Z"
}

```

---

### 5. Módulo de Encontros e Formações (`/api/v1/lectures`)

#### **Criar um Novo Encontro / Aula**

* **Método**: `POST`
* **Rota**: `/create`
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Payload Esperado (JSON)**:

```json
{
  "location": "Salão Paroquial Principal",
  "theme": "A História da Salvação e a Aliança com Deus",
  "hour": "14:30:00",
  "date": "2026-05-23",
  "classId": 2,
  "userIds": [4]
}

```

* **Regras de Validação**:
* Os parâmetros de localização, tema, hora, data e ID da turma são estritamente obrigatórios.
* `userIds` representa um array contendo os IDs dos catequistas responsáveis pela aplicação do encontro.
* A turma informada deve ser previamente validada e pertencer à paróquia do usuário requisitante.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "id": 8,
  "location": "Salão Paroquial Principal",
  "theme": "A História da Salvação e a Aliança com Deus",
  "hour": "14:30:00",
  "date": "2026-05-23",
  "ClassId": 2,
  "createdAt": "2026-05-16T23:20:00.000Z",
  "updatedAt": "2026-05-16T23:20:00.000Z"
}

```

#### **Listar Encontros Relacionados a uma Turma Específica**

* **Método**: `GET`
* **Rota**: `/:classId` *(Ex: `/api/v1/lectures/2`)*
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: `Admin`, `Coordenador`, `Catequista`.
* **Diferencial**: O retorno inclui automaticamente o array de objetos dos usuários (catequistas) vinculados de forma associativa através da tabela $N:M$.
* **Resposta de Sucesso (200 OK)**:

```json
[
  {
    "id": 8,
    "location": "Salão Paroquial Principal",
    "theme": "A História da Salvação e a Aliança com Deus",
    "hour": "14:30:00",
    "date": "2026-05-23",
    "ClassId": 2,
    "Users": [
      {
        "id": 4,
        "name": "João da Silva",
        "role": "Catequista"
      }
    ]
  }
]

```

---

### 6. Módulo de Faltas (`/api/v1/absences`)

#### **Registrar uma Falta Justificada para um Aluno**

* **Método**: `POST`
* **Rota**: `/:studentId` *(Ex: `/api/v1/absences/12`)*
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: Restrito ao cargo `Catequista`.
* **Payload Esperado (JSON)**:

```json
{
  "lectureId": 8,
  "reason": "Aluno estava com febre e os pais enviaram atestado médico."
}

```

* **Regras de Validação**:
* `reason` (motivo da ausência) e `lectureId` (encontro correspondente) são obrigatórios.
* Verifica a existência concreta do Aluno (`studentId`) e do Encontro (`lectureId`).
* Executado sob escopo de transação SQL (`conn.transaction()`), garantindo rollback em caso de falha de concorrência.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "message": "A falta foi registrada com sucesso!"
}

```

---

### 7. Módulo de Presenças (`/api/v1/attendances`)

#### **Registrar Presença de um Aluno**

* **Método**: `POST`
* **Rota**: `/:studentId` *(Ex: `/api/v1/attendances/12`)*
* **Autenticação**: Obrigatória (`Bearer <JWT_TOKEN>`).
* **Cargos Permitidos**: Restrito ao cargo `Catequista`.
* **Payload Esperado (JSON)**:

```json
{
  "lectureId": 8
}

```

* **Regras de Validação**:
* O parâmetro de rota `studentId` e o corpo contendo `lectureId` são obrigatórios.
* Valida a existência prévia do estudante e do encontro na base de dados antes de persistir a presença.
* Segue o controle transacional ACID isolado.


* **Resposta de Sucesso (201 Created)**:

```json
{
  "message": "Presença registrada com sucesso!"
}

```

---

## 🛡️ Tratamento de Erros Comuns

A API responde de forma previsível e padronizada utilizando códigos de status HTTP apropriados:

* **`400 Bad Request`**: Falha estrutural de validação de dados obrigatórios ausentes no payload.
* **`401 Unauthorized`**: Cabeçalho `Authorization` ausente, malformado ou token JWT expirado/inválido.
* **`403 Forbidden`**: O usuário está autenticado, mas a sua Role (Cargo) não possui permissão para acessar a ação ou está tentando manipular dados de outra Paróquia.
* **`404 Not Found`**: Entidade (Paróquia, Usuário, Endereço ou Turma) não mapeada nos identificadores da tabela.
* **`409 Conflict`**: Violação de constraint de unicidade (Ex: Cadastro de um Aluno com CPF já existente na mesma turma).
* **`422 Unprocessable Entity`**: Tipagem incorreta de dados ou dados logicamente inválidos (Ex: Passar um ID de paróquia em formato string de texto ao invés de um número inteiro).
* **`500 Internal Server Error`**: Exceções não tratadas no servidor ou interrupções de conexão com o PostgreSQL. O erro detalhado será impresso no console da aplicação.
"""

```
