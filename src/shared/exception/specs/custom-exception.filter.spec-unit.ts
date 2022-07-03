/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-10
 */
import '../../../initEnv';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CustomExceptionFilter } from '../custom-exception.filter';
import { DiscordService } from '../../discord/discord.service';

describe('CustomExceptionFilter', () => {
    let filter: CustomExceptionFilter;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        filter = new CustomExceptionFilter(moduleFixture.get(DiscordService));
    });

    it('should test string to badge', () => {
        const sut = 'Error';
        const expected =
            ':regional_indicator_e::regional_indicator_r::regional_indicator_r::regional_indicator_o::regional_indicator_r:';
        const result = filter.toDiscordBadgeString(sut);

        expect(result).toBe(expected);
    });

    it('should test number to badge', () => {
        const sut = 123456789;
        const expected =
            ':one::two::three::four::five::six::seven::eight::nine:';
        const result = filter.toDiscordBadgeNumber(sut);

        expect(result).toBe(expected);
    });
});
