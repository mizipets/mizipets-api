/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
    @IsNotEmpty()
    @IsString()
    deviceType: string;

    @IsNotEmpty()
    @IsString()
    os: string;

    @IsNotEmpty()
    @IsString()
    os_version: string;

    @IsString()
    browser?: string;

    @IsString()
    browser_version?: string;
}
