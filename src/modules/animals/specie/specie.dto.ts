import { Specie } from '../entities/specie.entity';
import { SpecieCategory } from '../enum/specie.category';
import { RaceDTO } from '../race/race.dto';

export class SpecieDTO {
    private id: number;
    private name: string;
    private category: SpecieCategory;
    private races: RaceDTO[];

    constructor(specie: Specie, lang = 'fr') {
        this.id = specie.id;
        this.category = specie.category;

        let nameLang = specie.names.find(
            (langContent) => langContent.lang === lang
        );
        if (!nameLang) {
            nameLang = specie.names.find(
                (langContent) => langContent.lang === 'fr'
            );
        }
        this.name = nameLang.name;
        if (specie.races)
            this.races = specie.races.map((race) => new RaceDTO(race)) ?? [];
    }
}
