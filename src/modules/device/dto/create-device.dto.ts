/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
 import { IsNotEmpty, IsDate, IsString } from 'class-validator';
 
 export class CreateDeviceDto {

    @IsNotEmpty()
    @IsString()
    deviceType: string

    @IsNotEmpty()
    @IsString()
    device: string

    @IsString()
    browser?: string

 
 }
 