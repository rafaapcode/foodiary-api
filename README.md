# Foodiary API

API serverless para gerenciamento de refeições com análise nutricional automatizada utilizando inteligência artificial.

## 🚀 Tecnologias

### **Linguagem e Runtime**
- **TypeScript** - Linguagem principal com strict mode
- **Node.js 22.x** - Runtime de execução

### **Cloud & Infraestrutura (AWS)**
- **AWS Lambda** - Funções serverless
- **Amazon API Gateway (HTTP API)** - Endpoints REST com autenticação JWT
- **AWS DynamoDB** - Banco de dados NoSQL
- **Amazon S3** - Armazenamento de arquivos (imagens de refeições)
- **Amazon SQS** - Filas de mensagens assíncronas
- **Amazon CloudFront** - CDN para distribuição de conteúdo
- **Amazon Cognito** - Autenticação e gerenciamento de usuários
- **Serverless Framework** - IaC para deploy e gerenciamento da infraestrutura

### **Build & Bundling**
- **esbuild** - Bundler de alta performance
- **esbuild-plugin-tsc** - Plugin para suporte TypeScript

### **Validação**
- **Zod** - Validação de schemas e type-safe em runtime

### **Inteligência Artificial**
- **OpenAI API** - Análise de imagens e texto para processamento nutricional de refeições

### **Email Templates**
- **React Email** - Geração de templates de email com React
- **React** e **React DOM**
- **Tailwind CSS** (via @react-email/tailwind)

## 🏗️ Arquitetura e Padrões

- **Clean Architecture** - Separação em camadas (application, domain, infra, main)
- **Dependency Injection** - Sistema DI customizado com decorators e reflect-metadata
- **CQRS** - Separação de comandos e queries
- **Event-Driven Architecture** - Consumers de filas SQS e handlers de eventos S3
- **Saga Pattern** - Gerenciamento de transações distribuídas

## 📁 Estrutura do Projeto

```
src/
├── application/      # Casos de uso, controllers e entidades
│   ├── controllers/  # Controllers organizados por domínio
│   ├── entities/     # Entidades de domínio
│   ├── usecases/     # Casos de uso da aplicação
│   ├── query/        # Query handlers (CQRS)
│   └── queues/       # Consumers de filas
├── infra/           # Implementações de infraestrutura
│   ├── ai/          # Integração com OpenAI
│   ├── clients/     # Clientes AWS
│   ├── database/    # Implementação DynamoDB
│   ├── emails/      # Templates de email
│   └── gateways/    # Gateways de serviços externos
├── kernel/          # Core da aplicação (DI, decorators)
├── main/            # Adaptadores e entry points
│   ├── adapters/    # Adaptadores Lambda
│   └── functions/   # Definições de funções Lambda
└── shared/          # Código compartilhado
```

## 🛠️ Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **TypeScript ESLint** - Rules específicas para TypeScript
- **tsx** - Execução de scripts TypeScript
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Outras Bibliotecas

- **ksuid** - Geração de IDs únicos ordenados cronologicamente
- **ts-dedent** - Formatação de strings multilinhas

## 🌎 Região

A aplicação está deployada na região **sa-east-1** (São Paulo) da AWS.


## 🎯 Funcionalidades Principais

- Autenticação de usuários (SignIn, SignUp, Refresh Token, Reset Password)
- Gerenciamento de perfil e metas nutricionais
- Criação e listagem de refeições
- **Análise nutricional automatizada** via IA (texto ou imagem)
- Cálculo automático de macronutrientes
- Armazenamento seguro de imagens de refeições
- Processamento assíncrono via filas
