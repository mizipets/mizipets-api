/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-20
 */
import { ConnectionOptions } from 'typeorm';
import '../src/initEnv';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE
} = process.env;

export default {
    name: 'seed',
    type: 'postgres',
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    entities: ['src/**/*.entity.ts']
} as ConnectionOptions;
