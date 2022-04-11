/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { Module } from '@nestjs/common';
import { RootController } from './root.controller';

@Module({
    controllers: [RootController]
})
export class RootModule {}
