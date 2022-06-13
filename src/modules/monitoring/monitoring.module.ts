import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
    imports: [HealthModule, MetricsModule, PrometheusModule],
    exports: [HealthModule, MetricsModule, PrometheusModule]
})
export class MonitoringModule {}
