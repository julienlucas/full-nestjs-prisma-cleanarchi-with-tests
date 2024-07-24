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
├── Domain
│   ├── Entities (règles métier)
│   ├── Models (data models TypeScript)
│   └── Use cases (actions/logique métier)
└── Infrastructure
    └── Common (utils communs)
    └── Controllers (définition des endpoints et actions / swagger )
    └── Repositories (connexion aux API's, BDD's)
    └── Presenters (adapters sortie de la data des use cases)
    └── Prisma (ORM)

```

## License

Nest is [MIT licensed](LICENSE).
