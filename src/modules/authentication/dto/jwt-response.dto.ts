/**
 * @author Julien DA CORTE
 * @create 2022-03-5
 */
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class JwtResponseDto {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    token: string;
}
