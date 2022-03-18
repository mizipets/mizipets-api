import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

const { WATCHDOG_WEBHOOK } = process.env;

@Injectable()
export class DiscordService {
    discordClient: AxiosInstance;

    constructor() {
        this.discordClient = axios.create({
            baseURL: WATCHDOG_WEBHOOK
        });
    }

    async sendMsg(msg: string) {
        const params = {
            username: 'Watchdog',
            content: msg
        };
        return await this.discordClient.post('', params);
    }
}
