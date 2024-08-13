## KNEX

### To create new migration
```bash
npx knex migrate:make <migration_name>
```

### To create new seek
```bash
npx knex seek:make <seek_name>
```


### For Database migration
```bash
npx knex migrate:latest
```

### For Database seek
```bash
npx knex seed:run
```

### To perform migration on docker node application
```bash
docker exec -it node_advance sh -c "npm run db:migrate"
```

### Build local node application over docker container
```bash
docker build -t node_advance .
```