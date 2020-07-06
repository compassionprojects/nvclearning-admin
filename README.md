## Development

We use docker for development. To start run

```
npm i # for enabling code formatting and linting
docker-compose -d
```

Then visit localhost:3000

Setup an alias for docker-compose in your `~/.bashrc` file

```
alias dc="docker-compose"
```

You may have to run

```
dc exec api npm run create-tables
```

and then to seed initial data

```
dc exec api yarn run knex seed:run
```

To add a migration

```
dc exec api yarn run knex migrate:make migration_name
```

To run the migrations run

```
dc exec api yarn run knex migrate:latest
```
