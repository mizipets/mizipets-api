/**
 * @author Julien DA CORTE
 * @create 2022-03-5
 */
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    token: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    refreshKey: string;
}
