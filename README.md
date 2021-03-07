## Development

We use docker for development. To start run

```sh
npm i # for enabling code formatting and linting
docker-compose -d
```

Then visit localhost:3000

Setup an alias for docker-compose in your `~/.bashrc` file

```sh
alias dc="docker-compose"
```

You may have to run

```sh
dc exec api npm run create-tables
```

and then to seed initial data

```sh
dc exec api yarn run knex seed:run
```

To add a migration

```sh
dc exec api yarn run knex migrate:make migration_name
```

To run the migrations run

```sh
dc exec api yarn run knex migrate:latest
```

## Deployment

```sh
git push heroku `git subtree split --prefix src master`:master
# or make deploy
```
