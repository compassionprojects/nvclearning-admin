## Tech stack

- Node.js v16.5.0 (Use [asdf](https://asdf-vm.com/guide/getting-started.html) to manage node versions. We already include a `.tool_versions` file which supports asdf)
- KeystoneJS
- Postgres with GraphQL

## Development

```sh
npm i yarn@1.22.21 -g
yarn install
cp .env.example .env
# update ADMIN_EMAIL, ADMIN_PASSWORD and DO_BUCKET env variables
yarn run dev
```

Then open [localhost:3000/admin](http://localhost:3000/admin).

To create the initial admin user, you can run the seed migration

```sh
yarn run knex seed:run
```

## Migrations

To add a migration

```sh
yarn run knex migrate:make migration_name
```

To run the migrations run

```sh
yarn run knex migrate:latest
```

## Docker

_Not tested currently_

or you may also use docker for development by running

```sh
docker-compose up -d
```

Then visit localhost:3000

Setup an alias for docker-compose in your `~/.bashrc` file

```sh
alias dc="docker-compose"
```

## Deployment

