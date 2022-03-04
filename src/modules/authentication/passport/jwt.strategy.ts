import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: process.env.ENV_NAME === 'local',
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: JwtPayloadDto): Promise<User> {
        const user: User = await this.usersService.getById(payload.id);
        if (!user) throw new UnauthorizedException('Invalid token.');

        return user;
    }
}
