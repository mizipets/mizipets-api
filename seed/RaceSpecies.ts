import { MigrationInterface, QueryRunner } from 'typeorm';
import { Race } from '../src/modules/animals/entities/race.entity';
import { Species } from '../src/modules/animals/entities/species.entity';
import * as fs from 'fs';

export class RaceSpecies1515769694450 implements MigrationInterface {
    races: any = JSON.parse(fs.readFileSync('assets/races.json').toString());
    species: any = JSON.parse(
        fs.readFileSync('assets/species.json').toString()
    );

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Species, this.getSpecies());
        console.log('Seeding Species complete');
        await queryRunner.manager.save(Race, this.getRaces());
        console.log('Seeding Races complete');
    }

    private getRaces(): Race[] {
        let counter = 0;
        const races: Race[] = [];
        Object.entries(this.races).forEach(
            (speciesRace: [string, string[]]) => {
                races.push(
                    ...speciesRace[1].map((race) => {
                        return {
                            id: counter++,
                            name: race,
                            species: this.getSpecie(parseInt(speciesRace[0])),
                            animals: []
                        };
                    })
                );
            }
        );
        return races;
    }

    private getSpecie(id: number): Species {
        return this.getSpecies().find((specie) => specie.id === id);
    }

    private getSpecies(): Species[] {
        return this.species as Species[];
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER SEQUENCE races_id_seq RESTART WITH 1');
        await queryRunner.query('DELETE FROM public.races WHERE TRUE;');
        await queryRunner.query('ALTER SEQUENCE species_id_seq RESTART WITH 1');
        await queryRunner.query('DELETE FROM public.species WHERE TRUE;');
    }
}
