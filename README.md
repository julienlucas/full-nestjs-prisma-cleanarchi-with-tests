# CleanArchi back-end Nestjs / Prisma

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Swagger
Le Swagger est disponible à : http://localhost:3000/api-docs

```
src
├── Adapters (Interface Adapters)
│   └── Controllers (connexion aux API's, BDD's)
│   └── Repositories (Abstract class pour Prisma - le vrai repository)
│   └── Presenters (adapters sortie de la data des use cases)
├── Domain
│   ├── Entities (règles métier)
│   ├── Models (data models TypeScript)
└── Infrastructure
│   └── Common (utils communs)
│   └── Controllers (définition des endpoints et actions / swagger )
│   └── Prisma (ORM - les repositories)
└── Use cases (actions/logique métier)

```

## License

Nest is [MIT licensed](LICENSE).
