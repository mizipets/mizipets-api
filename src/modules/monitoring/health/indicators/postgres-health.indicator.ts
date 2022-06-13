import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from '../interfaces/health-indicator.interface';
import {
    HealthIndicatorResult,
    TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { PrometheusService } from '../../prometheus/prometheus.service';

export class PostgresHealthIndicator
    extends BaseHealthIndicator
    implements HealthIndicator
{
    public readonly name = 'PostgresHealthIndicator';
    protected readonly help = 'Status of ' + this.name;

    constructor(
        private dbIndicator: TypeOrmHealthIndicator,
        protected promClientService: PrometheusService
    ) {
        super();
        this.registerMetrics();
        this.registerGauges();
    }

    public async isHealthy(): Promise<HealthIndicatorResult> {
        const results = await this.dbIndicator.pingCheck('postgres');
        this.updatePrometheusData(true);
        return results;
    }
}
