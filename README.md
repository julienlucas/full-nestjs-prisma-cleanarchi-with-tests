# CleanArchi back-end Nestjs / Prisma

## Installation

```bash
$ pnpm install
```

## Variables d'environnement

Aucun fichier `.env` n'est versionné (voir `.gitignore`). Il faut les créer en local
avant de lancer l'application.

### Fichiers attendus

| Fichier | Chargé par | Rôle |
| --- | --- | --- |
| `.env` | le CLI Prisma (automatiquement) | connexion à la base pour `prisma generate`, `prisma migrate`, `prisma studio` |
| `.env.stage.dev` | `ConfigModule` quand `STAGE=dev` | configuration de l'app en développement |
| `.env.stage.prod` | `ConfigModule` quand `STAGE=prod` | configuration de l'app en production |

Le fichier chargé par NestJS est résolu dynamiquement dans `src/app.module.ts` :

```ts
ConfigModule.forRoot({
  envFilePath: [`.env.stage.${process.env.STAGE}`],
  validationSchema: configValidationSchema
})
```

`STAGE` doit donc exister dans l'environnement du shell **avant** le démarrage : il
n'est pas lu depuis les fichiers `.env.stage.*`. Le script `pnpm run start:dev` le
positionne déjà (`STAGE=dev`).

### Variables

| Variable | Requise | Utilisée par | Description |
| --- | --- | --- | --- |
| `STAGE` | oui | `src/app.module.ts`, `config.schema.ts` | Environnement courant (`dev` ou `prod`). Détermine le fichier `.env.stage.<STAGE>` à charger. À définir dans le shell, pas dans un fichier `.env.stage.*`. |
| `DATABASE_URL` | oui | `schema.prisma` (`url`) | URL PostgreSQL **poolée** (PgBouncer). C'est la connexion utilisée par le client Prisma au runtime.<br>Ex. : `postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | oui | `schema.prisma` (`directUrl`) | URL PostgreSQL **directe** (sans pooler). Utilisée par Prisma pour les migrations et l'introspection.<br>Ex. : `postgresql://<user>:<password>@<host>:5432/postgres` |
| `JWT_SECRET` | oui | `auth.module.ts`, `jwt.strategy.ts` | Clé secrète de signature et de vérification des JWT. Doit être une chaîne longue et aléatoire, différente entre `dev` et `prod`. |
| `PORT` | non | `src/main.ts` | Port d'écoute HTTP. Valeur par défaut `3000` dans le schéma Joi (voir la note ci-dessous). |

> **Note sur `PORT`** — `src/main.ts` lit `process.env.PORT` *avant* l'initialisation de
> `ConfigModule`. La valeur par défaut `3000` du schéma Joi ne s'applique donc pas ici :
> si `PORT` n'est pas présent dans l'environnement du shell, `app.listen()` reçoit
> `undefined`. Définissez `PORT` dans le shell (ou dans la configuration de la plateforme
> d'hébergement) plutôt que dans un fichier `.env.stage.*`.

Ces variables sont validées au démarrage par Joi dans
`src/infrastructure/common/config.schema.ts` : l'application refuse de démarrer si
`STAGE` ou `JWT_SECRET` sont absents.

### Exemple de `.env` (Prisma)

```dotenv
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"
```

### Exemple de `.env.stage.dev` / `.env.stage.prod`

```dotenv
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"
JWT_SECRET="<chaîne-longue-et-aléatoire>"
```

Générer un `JWT_SECRET` :

```bash
$ openssl rand -base64 48
```

### Intégration continue et déploiement

Les tests GitHub Actions (`.github/workflows/main.yml`) ont besoin de `DATABASE_URL` et
`DIRECT_URL`. Déclarez-les en *repository secrets* et référencez-les via
`${{ secrets.DATABASE_URL }}` plutôt qu'en clair dans le workflow.

Sur Vercel, déclarez `STAGE`, `JWT_SECRET`, `DATABASE_URL` et `DIRECT_URL` dans les
*Environment Variables* du projet.

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

| Environnement | URL |
| --- | --- |
| Local (`pnpm run start:dev`) | http://localhost:3000/api-docs |
| Production (Vercel) | https://nestjs-cleanarchi.vercel.app/api-docs |

La spécification OpenAPI brute est servie sur le même chemin suffixé `-json`
(`/api-docs-json` en local comme en production) : pratique pour l'importer dans
Postman ou Insomnia, ou pour vérifier l'API sans l'interface.

> **Assets en production** — l'interface charge `swagger-ui-bundle.js` et
> `swagger-ui.css` depuis jsdelivr (voir `src/serverless.ts`). Ces fichiers
> viennent de `node_modules/swagger-ui-dist` et sont résolus au runtime par
> `@nestjs/swagger` : Vercel ne les embarque donc pas dans le bundle de la
> fonction, ils partaient en 404 et la page restait blanche. En local,
> `src/main.ts` les sert normalement depuis `node_modules`.

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
