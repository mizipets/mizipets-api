/**
 * @author Maxime D'HARBOULLE
 * @create date 2022-03-20
 */
import * as typeorm from 'typeorm';
import ormconfig from '../seed.ormconfig';

const main = (): void => {
    typeorm
        .createConnection(ormconfig)
        .then(async (connection) => {
            console.log('Connection opened');

            const runner = connection.createQueryRunner();

            //races
            await runner.query('ALTER SEQUENCE races_id_seq RESTART WITH 1');
            await runner.query('DELETE FROM public.races WHERE TRUE;');
            console.log('Cleared races');

            //species
            await runner.query('ALTER SEQUENCE species_id_seq RESTART WITH 1');
            await runner.query('DELETE FROM public.species WHERE TRUE;');
            console.log('Cleared species');

            await connection.close();
            console.log('Connection closed');
        })
        .catch((e) => {
            console.log(e);
        });
};

main();
