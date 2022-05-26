import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '../prometheus/prometheus.module';

@Module({
    imports: [HttpModule, TerminusModule, forwardRef(() => PrometheusModule)],
    controllers: [HealthController],
    providers: [HealthService],
    exports: [HealthService]
})
export class HealthModule {}
