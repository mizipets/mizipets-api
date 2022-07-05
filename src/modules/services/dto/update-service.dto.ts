/**
 * @author Julien DA CORTE
 * @create 2022-04-20
 */

import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly imagePath: string;
}
