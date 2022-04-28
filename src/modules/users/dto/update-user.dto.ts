/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { Address, Preferences, Shelter } from '../entities/user.entity';

export class UpdateUserDto {
    readonly firstname: string;

    readonly lastname: string;

    readonly email: string;

    readonly address: Address;

    readonly preferences: Preferences;

    readonly shelter: Shelter;
}
