module.exports = [
    {
        name: 'seed',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        entities: ['./src/**/*.entity.ts'],
        migrations: ['./seed/*.ts'],
        cli: {
            migrationsDir: './seed'
        }
    }
];
