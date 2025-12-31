<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript" width="80" />
  <img src="https://bun.sh/logo.svg" alt="Bun" width="80" />
  <br />
  <h1>🚀 TypeScript DDD Boilerplate (Bun Edition)</h1>
  <p>
    <strong>A robust, production-ready foundation for building scalable Microservices using Domain-Driven Design and Hexagonal Architecture.</strong>
  </p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Bun](https://img.shields.io/badge/Bun-v1.3.0-000?style=for-the-badge&logo=bun)](https://bun.sh/)
  [![Architecture](https://img.shields.io/badge/Architecture-DDD%20%2B%20Hexagonal-orange?style=for-the-badge)](https://martinfowler.com/bliki/HexagonalArchitecture.html)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## 📖 Introduction

This project is a boilerplate designed to demonstrate how to build complex, maintainable software using **Domain-Driven Design (DDD)** principles, powered by the blazing fast **Bun** runtime.

It is structured to be:

- **🔰 Junior-Friendly:** Clear separation of concerns makes it easy to understand where code belongs.
- **🛡️ Bulletproof:** Uses Value Objects and Aggregates to ensure your data is always consistent.
- **⚡ Fast:** Leveraging Bun's native SQLite/PostgreSQL drivers and runtime.

---

## 🏗️ Architecture Explained

We follow the **Dependency Rule**: _Source code dependencies can only point inwards_. Nothing in an inner circle can know anything at all about something in an outer circle.

### The 3-Layer Composition

```mermaid
graph TD
    subgraph "Infrastructure Layer 🔧"
        HTTP[API Controllers]
        DB[Database Adapters]
        BusImpl[Event Bus Implementation]
    end

    subgraph "Application Layer 🧠"
        UC[Use Cases / Services]
    end

    subgraph "Domain Layer 💎"
        Model[Aggregates & Entities]
        VO[Value Objects]
        Repos[Repository Interfaces]
        Events[Domain Events]
    end

    HTTP --> UC
    UC --> Model
    UC --> Repos
    DB -.->|Implements| Repos

    style Model fill:#e1f5fe,stroke:#01579b
    style UC fill:#fff3e0,stroke:#ef6c00
    style HTTP fill:#f3e5f5,stroke:#7b1fa2
    style DB fill:#f3e5f5,stroke:#7b1fa2
```

### Why this architecture?

| Layer              | Responsibility   | Why?                                                                      |
| ------------------ | ---------------- | ------------------------------------------------------------------------- |
| **Domain**         | Business Rules   | Keeps code pure. If the DB changes, your business logic **doesn't care**. |
| **Application**    | Orchestration    | Connects the user's intent (e.g., "Create Product") with the Domain.      |
| **Infrastructure** | Tools & Delivery | The "real world". Databases, HTTP Servers, File Systems.                  |

---

## 📂 Project Structure

This project uses a **Bounded Context** directory structure (`src/contexts`), ensuring modularity.

```mermaid
graph LR
    Root[src] --> Contexts[contexts]
    Contexts --> Catalog[catalog 🛒]
    Contexts --> Shared[shared 🔗]

    Catalog --> Products[products]
    Products --> P_Domain[domain]
    Products --> P_App[application]
    Products --> P_Infra[infrastructure]

    Shared --> Bus[bus]
    Shared --> S_Infra[infrastructure]

    style Catalog fill:#d1c4e9
    style Shared fill:#cfd8dc
```

### 🧠 Deep Dive into Components

#### 1. The Domain (The Core)

Located in `src/contexts/catalog/products/domain`.  
This includes the **Product** entity and **Price** value object. Note how `Price` ensures data validity immediately upon creation.

```typescript
// Example: Value Object logic
if (amount < 0) throw new Error("Price cannot be negative");
```

#### 2. The Ports (Interfaces)

Located in `domain/ProductRepository.ts`.  
We define _what_ we need (save, search), but not _how_ to do it. This allows us to swap databases easily.

#### 3. The Adapters (Infrastructure)

Located in `infrastructure/BunSqlProductRepository.ts`.  
This implements the interface using **Bun's Native SQL**.

```mermaid
sequenceDiagram
    participant App as Application Service
    participant Repo as ProductRepository (Interface)
    participant Adapter as BunSqlProductRepository
    participant DB as PostgreSQL

    App->>Repo: save(product)
    Note right of App: App relies on the Interface
    Repo->>Adapter: (Runtime execution)
    Adapter->>Adapter: product.toPrimitives()
    Adapter->>DB: INSERT INTO products...
    DB-->>Adapter: Success
    Adapter-->>App: void
```

---

## ⚡ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`).
- A PostgreSQL database (local or cloud).

### 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo/typescript_express_ddd.git
   cd typescript_express_ddd
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Configure Environment**
   Create a `.env` file in the root:

   ```bash
   DATABASE_URL="postgres://user:password@localhost:5432/mydb"
   ```

4. **Run the Project**
   ```bash
   bun run index.ts
   ```

---

## 🧪 Testing (Coming Soon)

Ideally, this architecture allows:

- **Unit Tests:** For Domain entities (Logic without DB).
- **Integration Tests:** For Infrastructure adapters (Testing the SQL queries).
- **Acceptance Tests:** For Use Cases (Testing the whole feature).

---

## 🤝 Contributing

1. Fork it.
2. Create your feature branch (`git checkout -b feature/cool-feature`).
3. Commit your changes.
4. Push to the branch.
5. Create a new Pull Request.

---

<div align="center">
  <sub>Built with ❤️ by an AI Assistant & You.</sub>
</div>
