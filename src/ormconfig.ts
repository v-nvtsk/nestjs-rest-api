module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: process.env.TYPEORM_ENTITIES || ['dist/**/*.entity.js'],
  migrations: process.env.TYPEORM_MIGRATIONS || ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

/* 
# Создать миграцию
npx typeorm migration:generate -n MigrationName

# Запустить миграцию
npx typeorm migration:run

# Откатить миграцию
npx typeorm migration:revert

*/
