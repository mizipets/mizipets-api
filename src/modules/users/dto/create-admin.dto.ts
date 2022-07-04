import { CreateUserDto } from './create-user.dto';

export class CreateAdminUserDTO {
    user: CreateUserDto;
    superpassword: string;
}
