/**
 * @author Julien DA CORTE
 * @create 2022-04-22
 */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { AnimalsService } from '../animals/animals.service';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

@Injectable()
export class S3Service {
    constructor(
        private animalService: AnimalsService,
        private userService: UsersService
    ) {}

    async uploadFile(
        userId: number,
        id: number,
        type: string,
        file: any
    ): Promise<void> {
        let animalOrUser: Animal | User;
        let photoUrl;

        if (!this.checkMimetype(file.mimetype))
            throw new ForbiddenException('Only images are allowed');

        if (type === 'animal') {
            animalOrUser = await this.animalService.getById(id);
            if (animalOrUser.owner.id !== userId)
                throw new ForbiddenException('Wrong access');

            photoUrl = await this.uploadToS3(type, id, file);
            await this.animalService.updateImages(id, photoUrl.Location);
        } else {
            animalOrUser = await this.userService.getById(id);
            if (animalOrUser.id !== userId)
                throw new ForbiddenException('Wrong access');

            photoUrl = await this.uploadToS3(type, id, file);
            await this.userService.updateAvatar(id, photoUrl.Location);
        }
    }

    private async uploadToS3(
        type: string,
        id: number,
        file: any
    ): Promise<any> {
        const newUuid = uuidv4();
        return s3
            .upload({
                Bucket: AWS_S3_BUCKET_NAME,
                Body: file.buffer,
                Key: `${type}_${id}_${newUuid}`
            })
            .promise();
    }

    private checkMimetype(imageType: string): boolean {
        const authorizedTypes = [
            'image/bmp',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff'
        ];
        return authorizedTypes.includes(imageType);
    }
}
