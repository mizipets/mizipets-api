/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import * as dotenv from 'dotenv';

if (!process.env.ENV) {
    process.stdout.write(
        'ENV variable has not been set.\nWorking in local environment by default.\n'
    );
}

const ENV = process.env.ENV || 'local';

dotenv.config({ path: `${__dirname}/../envs/.env.${ENV}` });
process.stdout.write(`Working in ${ENV} environment\n`);
