/**
 * @author Maxime D'HARBOULLE
 * @create date 2022-03-20
 */
import * as typeorm from 'typeorm';
import { Race } from '../../src/modules/animals/entities/race.entity';
import { Specie } from '../../src/modules/animals/entities/specie.entity';
import { Service } from '../../src/modules/services/entities/service.entity';
import ormconfig from '../seed.ormconfig';
import * as fs from 'fs';
import { Advice } from '../../src/modules/advices/entities/advices.entity';

const jsonRaces: any = JSON.parse(
    fs.readFileSync('assets/races.json').toString()
);
const jsonSpecies: any = JSON.parse(
    fs.readFileSync('assets/species.json').toString()
);

const jsonServices: any = JSON.parse(
    fs.readFileSync('assets/services.json').toString()
);

const jsonAdvices: any = JSON.parse(
    fs.readFileSync('assets/advices.json').toString()
);

const getRaces = (): Race[] => {
    let counter = 0;
    const races: Race[] = [];

    const species = getSpecies();
    const jsonRacesUpdated = jsonRaces;

    for (const specie of species) {
        if (!(specie.id in jsonRacesUpdated)) {
            jsonRacesUpdated[specie.id] = [];
        }
    }

    Object.entries(jsonRacesUpdated).forEach(
        (specieRace: [string, string[]]) => {
            races.push(
                {
                    id: counter++,
                    names: [
                        {
                            lang: 'fr',
                            name: 'Incconue'
                        },
                        {
                            lang: 'en',
                            name: 'Unknown'
                        }
                    ],
                    specie: getSpecie(parseInt(specieRace[0])),
                    animals: []
                },
                ...specieRace[1].map((race) => {
                    return {
                        id: counter++,
                        name: race,
                        names: [
                            {
                                lang: 'fr',
                                name: race[0]
                            },
                            {
                                lang: 'en',
                                name: race[1]
                            }
                        ],
                        specie: getSpecie(parseInt(specieRace[0])),
                        animals: []
                    };
                })
            );
        }
    );
    return races;
};

const getSpecie = (id: number): Specie => {
    return getSpecies().find((specie) => specie.id === id);
};

const getSpecies = (): Specie[] => {
    return jsonSpecies as Specie[];
};

const getServices = (): Service[] => {
    return jsonServices as Service[];
};

const getAdvices = (): Advice[] => {
    return jsonAdvices.map((advice) => {
        advice.specie = getSpecie(advice.specieId);
        delete advice.specieId;
        return advice;
    }) as Advice[];
};

const main = (): void => {
    typeorm.createConnection(ormconfig).then(async (connection) => {
        console.log('Connection opened');

        const runner = connection.createQueryRunner();

        await runner.manager.save(Service, getServices());
        console.log('Seeding Services complete');

        connection.close();
        console.log('Connection closed');
    });
};

main();
