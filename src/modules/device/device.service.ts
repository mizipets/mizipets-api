/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
 import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device) private readonly repository: Repository<Device>
    ) {} 

    async getAll(): Promise<Device[]> {
        return await this.repository.find({ relations: [] });
    }
    

    async getByUserID(id: number): Promise<Device[]> {
        const db = await this.repository.find({
            where: {
                user: {
                  id: id,
                }
              }
        });
        if (!db) {
            throw new NotFoundException(`No devices for id: ${id}`);
        } else {
            return db;
        }
    }


    async create(deviceDto: CreateDeviceDto, owner: User): Promise<Device> {
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

    async update(device: Device): Promise<Device> {
        device.lastConnection = new Date;

        return this.repository.save(device);
    }

    newDeviceCheck(devices: Device[], deviceDTO: CreateDeviceDto): Boolean {
        for (var i = 0; i < devices.length; i++) {
            if (deviceDTO.deviceType == devices[i].deviceType &&
                deviceDTO.os == devices[i].os) {
                return false;
            }
        }
        return true;
    }

    getDeviceCheckedID(devices: Device[], deviceDTO: CreateDeviceDto): Device {
        for (var i = 0; i < devices.length; i++) {
            if (deviceDTO.deviceType == devices[i].deviceType &&
                deviceDTO.os == devices[i].os) {
                return devices[i];
            }
        }
    }
}