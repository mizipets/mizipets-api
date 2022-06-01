/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, Shelter, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../authentication/enum/roles.emum';
import { Animal } from '../animals/entities/animal.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { MailService } from '../../shared/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../s3/s3.service';

const { JWT_REFRESH_EXPIRATION } = process.env;

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly repository: Repository<User>,
        @Inject(forwardRef(() => FavoritesService))
        private readonly favoritesService: FavoritesService,
        private readonly emailService: MailService,
        private readonly s3Service: S3Service
    ) {}

    async getAll(relations: string[] = []) {
        return await this.repository.find({
            relations: relations
        });
    }

    async getById(id: number, relations: string[] = []): Promise<User> {
        const user: User = await this.repository.findOne({
            where: { id: id },
            relations: relations
        });

        if (!user) throw new NotFoundException(`User with id: ${id} not found`);
        user.password = undefined;
        return user;
    }

    async getByEmail(email: string, addPassword = false): Promise<User> {
        let user: User;

        if (addPassword) {
            user = await this.repository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', {
                    email: email
                })
                .getOne();
        } else {
            user = await this.repository.findOne({
                where: { email: email }
            });
        }

        if (!user)
            throw new NotFoundException(`User with email: ${email} not found`);

        return user;
    }

    async isEmailExist(email: string): Promise<boolean> {
        const user: User = await this.repository.findOne({
            where: { email: email }
        });
        return !!user;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const favorites = await this.favoritesService.createFavoritesForUser();
        const newUser = new User();
        let role: Roles = Roles.STANDARD;
        let shelter: Shelter = null;

        if (userDto.shelter && userDto.shelter.name !== '') {
            role = Roles.PRO;
            shelter = userDto.shelter;
        }

        newUser.email = userDto.email;
        newUser.password = userDto.password;
        newUser.firstname = userDto.firstname;
        newUser.lastname = userDto.lastname;
        newUser.address = userDto.address;
        newUser.photo = userDto.photo;
        newUser.code = null;
        newUser.role = role;
        newUser.closeDate = null;
        newUser.animals = [];
        newUser.favorites = favorites;
        newUser.preferences = userDto.preferences;
        newUser.shelter = shelter;
        newUser.notifications = [];
        newUser.devices = [];

        this.repository.create(newUser);
        return this.repository.save(newUser);
    }

    async update(id: number, userDto: UpdateUserDto): Promise<User> {
        const user: User = await this.getById(id);
        const isEmail = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        user.firstname = userDto.firstname ?? user.firstname;
        user.lastname = userDto.lastname ?? user.lastname;
        user.email = userDto.email.match(isEmail) ? userDto.email : user.email;
        user.address = userDto.address ?? user.address;
        user.preferences = userDto.preferences ?? user.preferences;
        user.shelter = userDto.shelter ?? user.shelter;

        return this.repository.save(user);
    }

    async updateRefreshToken(id: number): Promise<RefreshToken> {
        const expiredAt = new Date();
        expiredAt.setSeconds(
            expiredAt.getSeconds() + parseInt(JWT_REFRESH_EXPIRATION)
        );
        const refreshTokenUUID = uuidv4();
        const refreshToken: RefreshToken = {
            refreshKey: refreshTokenUUID.toString(),
            expireAt: expiredAt.getTime()
        };

        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ refreshToken: refreshToken })
            .where('id = :id', { id: id })
            .execute();

        return refreshToken;
    }

    async updateFlutterToken(token: string, id: number): Promise<string> {
        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ flutterToken: token })
            .where('id = :id', { id: id })
            .execute();

        return token;
    }

    async updatePassword(id: number, password: string): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ password: password })
            .where('id = :id', { id: id })
            .execute();
    }

    async updateAvatar(id: number, photo: string): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ photo: photo })
            .where('id = :id', { id: id })
            .execute();
    }

    async updateCode(id: number, code: number): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ code: code })
            .where('id = :id', { id: id })
            .execute();
    }

    async close(id: number): Promise<void> {
        const user: User = await this.getById(id);

        await this.repository
            .createQueryBuilder()
            .update(User)
            .set({ closeDate: new Date() })
            .where('id = :id', { id: id })
            .execute();

        await this.emailService.sendCloseAccount(user);
    }

    async addAnimalToUser(animal: Animal, owner: User): Promise<User> {
        const user = await this.getById(owner.id, ['animals']);
        user.animals.push(animal);
        return this.repository.save(user);
    }
}
