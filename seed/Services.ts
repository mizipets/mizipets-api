/**
 * @author Maxime d'Harboullé
 * @email maxime.dharboulle@gmail.com
 * @create date 2022-03-16 00:31:18
 * @modify date 2022-03-16 00:31:18
 * @desc [description]
 */
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import { Service } from '../src/modules/services/entities/service.entity';

export class Services1515769694450 implements MigrationInterface {
    services: any = JSON.parse(
        fs.readFileSync('assets/services.json').toString()
    );

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Service, this.getServices());
        console.log('Seeding Services complete');
    }

    private getServices(): Service[] {
        return this.services as Service[];
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER SEQUENCE services_id_seq RESTART WITH 1'
        );
        await queryRunner.query('DELETE FROM public.services WHERE TRUE;');
    }
}
