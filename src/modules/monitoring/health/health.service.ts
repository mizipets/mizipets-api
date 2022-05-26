import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    HttpHealthIndicator,
    TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { PrometheusService } from '../prometheus/prometheus.service';
import { HealthIndicator } from './interfaces/health-indicator.interface';
import { ApiHealthIndicator } from './indicators/api-health.indicator';
import { PostgresHealthIndicator } from './indicators/postgres-health.indicator';

@Injectable()
export class HealthService {
    private readonly listOfThingsToMonitor: HealthIndicator[];

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        @Inject(forwardRef(() => PrometheusService))
        private promClientService: PrometheusService,
        private postgres: TypeOrmHealthIndicator
    ) {
        this.listOfThingsToMonitor = [
            new ApiHealthIndicator(
                this.http,
                'http://localhost:3000/v1',
                this.promClientService
            ),
            new PostgresHealthIndicator(this.postgres, this.promClientService)
        ];
    }

    @HealthCheck()
    public async check(): Promise<HealthCheckResult | undefined> {
        return await this.health.check([
            ...this.listOfThingsToMonitor.map(
                (apiIndicator: HealthIndicator) => async () => {
                    try {
                        return await apiIndicator.isHealthy();
                    } catch (e) {
                        Logger.warn(e);
                        return apiIndicator.reportUnhealthy();
                    }
                }
            )
        ]);
    }
}
