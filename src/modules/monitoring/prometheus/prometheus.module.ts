import { forwardRef, Module } from '@nestjs/common';
import { HealthModule } from '../health/health.module';
import { PrometheusService } from './prometheus.service';

@Module({
    imports: [forwardRef(() => HealthModule)],
    providers: [PrometheusService],
    exports: [PrometheusService]
})
export class PrometheusModule {}
