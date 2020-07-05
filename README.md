## Development

We use docker for development. To start run

```
docker-compose -d
```

Then visit localhost:3000

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
