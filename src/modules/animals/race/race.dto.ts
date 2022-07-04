import { Race } from '../entities/race.entity';

export class RaceDTO {
    id: number;
    name: string;

    constructor(race: Race, lang = 'fr') {
        this.id = race.id;

        let nameLang = race.names.find(
            (langContent) => langContent.lang === lang
        );
        if (!nameLang) {
            nameLang = race.names.find(
                (langContent) => langContent.lang === 'fr'
            );
        }
        this.name = nameLang.name;
    }
}
