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

### Check typescript errors

```bash
npm run lint:tsx
```

### Check eslint errors

```bash
npm run lint:check
```

### Run App over Docker container

- index.ts (add host on app listening)
- knexfile.ts (change host to docker database container name)
- app.ts (set url in redis createClient of running redis container IP) CSRF Token
