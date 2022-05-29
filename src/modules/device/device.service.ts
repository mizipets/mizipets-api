/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../../shared/mail/mail.service';
import { LoginDto } from '../authentication/dto/login.dto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private readonly repository: Repository<Device>,
        private readonly mailService: MailService
    ) {}

    public async getAll(): Promise<Device[]> {
        return await this.repository.find({ relations: [] });
    }

    public async getByUserID(id: number): Promise<Device[]> {
        const db = await this.repository.find({
            where: {
                user: {
                    id: id
                }
            }
        });
        if (!db) {
            throw new NotFoundException(`No devices for id: ${id}`);
        } else {
            return db;
        }
    }

    private async create(
        deviceDto: CreateDeviceDto,
        owner: User
    ): Promise<Device> {
        const newDevice = new Device();
        newDevice.deviceType = deviceDto.deviceType;
        newDevice.os = deviceDto.os;
        newDevice.os_version = deviceDto.os_version;
        newDevice.browser = deviceDto.browser;
        newDevice.browser_version = deviceDto.browser_version;

        newDevice.user = owner;

        this.repository.create(newDevice);
        return this.repository.save(newDevice);
    }

    private async update(device: Device): Promise<Device> {
        device.lastConnection = new Date();

        return this.repository.save(device);
    }

    private newDeviceCheck(
        devices: Device[],
        deviceDTO: CreateDeviceDto
    ): boolean {
        for (let i = 0; i < devices.length; i++) {
            if (
                deviceDTO.deviceType == devices[i].deviceType &&
                deviceDTO.os == devices[i].os
            ) {
                return false;
            }
        }
        return true;
    }

    private async getDeviceCheckedID(
        devices: Device[],
        deviceDTO: CreateDeviceDto
    ): Promise<Device> {
        for (let i = 0; i < devices.length; i++) {
            if (
                deviceDTO.deviceType == devices[i].deviceType &&
                deviceDTO.os == devices[i].os
            ) {
                return devices[i];
            }
        }
    }

    public async createOrUpdateDevice(login: LoginDto, user: User) {
        const devices = await this.getByUserID(user.id);
        const deviceId = await this.getDeviceCheckedID(devices, login);

        if (devices.length > 0) {
            if (!deviceId) {
                await this.mailService.sendNewConnection(user);
                await this.create(login, user);
            } else {
                await this.update(deviceId);
            }
        } else {
            await this.create(login, user);
        }
    }
}
