import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { SpeciesCategory } from '../src/modules/animals/entity/species-category.enum';
import { Species } from '../src/modules/animals/entity/species.entity';

export class Species1515769694450 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Species, this.getSpeciess());
    }

    private getSpeciess(): Species[] {
        return [
            {
                id: 1,
                name: 'Dog',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 2,
                name: 'Cat',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 3,
                name: 'Ferret',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 4,
                name: 'Rabbit',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 5,
                name: 'Horse',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 6,
                name: 'Hamster',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 7,
                name: 'Guinea pig',
                category: SpeciesCategory.MAMMAL
            },
            {
                id: 8,
                name: 'Snake',
                category: SpeciesCategory.REPTILE
            },
            {
                id: 9,
                name: 'Lezard',
                category: SpeciesCategory.REPTILE
            },
            {
                id: 10,
                name: 'Turtle',
                category: SpeciesCategory.REPTILE
            }
        ] as Species[];
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query('DROP TABLE if exists species cascade;');
        // await queryRunner.clearTable('species');
        await queryRunner.query('ALTER SEQUENCE species_id_seq RESTART WITH 1');
        await queryRunner.query('DELETE FROM public.species WHERE TRUE;');
    }
}
