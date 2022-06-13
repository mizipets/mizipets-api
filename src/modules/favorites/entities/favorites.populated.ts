/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import { Animal } from '../../animals/entities/animal.entity';
import { ServiceType } from '../../services/enums/service-type.enum';
import { User } from '../../users/entities/user.entity';

export class FavoritesPopulated {
    id: number;
    reference: ReferencePopulated;
    type: ServiceType;
    user: User;
}
export type ReferencePopulated =
    | AdoptionReferencesPopulated
    | AdviceReferencesPopulated
    | PetsReferencesPopulated
    | VetsReferencesPopulated;

export class AdoptionReferencesPopulated {
    disliked: Animal[];
    liked: Animal[];
}

export class PetsReferencesPopulated {
    id?: Animal;
}

export class AdviceReferencesPopulated {
    id?: User;
}

export class VetsReferencesPopulated {
    id?: User;
}
