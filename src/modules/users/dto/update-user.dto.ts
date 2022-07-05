/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { Address, Preferences, Shelter } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty()
    readonly firstname: string;

    @ApiProperty()
    readonly lastname: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly address: Address;

    @ApiProperty()
    readonly preferences: Preferences;

    @ApiProperty()
    readonly shelter: Shelter;
}
