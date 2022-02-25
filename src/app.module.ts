import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RootModule } from './root/root.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['envs/.env', 'envs/.env.staging', 'envs/.env.production'],
      isGlobal: true,
    }),
    RootModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
