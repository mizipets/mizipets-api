/**
 * @author Julien DA CORTE
 * @create 2022-04-22
 */

import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { AnimalsService } from '../animals/animals.service';
import { UsersService } from '../users/users.service';

const {
    AWS_S3_BUCKET_URL,
    AWS_S3_BUCKET_NAME,
    API_URL,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    PORT
} = process.env;

const s3 = new AWS.S3({
    endpoint: AWS_S3_BUCKET_URL,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

@Injectable()
export class S3Service {
    constructor(
        @Inject(forwardRef(() => AnimalsService))
        private animalService: AnimalsService,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService
    ) {}

    async uploadFile(
        userId: number,
        id: number,
        type: 'animal' | 'avatar',
        file: any
    ): Promise<string> {
        if (!this.checkMimetype(file.mimetype))
            throw new ForbiddenException('Only images are allowed');

        const photo = await this.uploadToS3(type, id, file);
        // const apiImageUrl = this.keyToUrl(photo.key);

        if (type === 'animal') {
            const animal = await this.animalService.getById(id);
            if (animal.owner.id !== userId)
                throw new ForbiddenException('Wrong access');

            await this.animalService.updateImages(id, photo.key);
        }

        if (type === 'avatar') {
            const user = await this.userService.getById(id);
            if (user.id !== userId)
                throw new ForbiddenException('Wrong access');

            await this.userService.updateAvatar(id, photo.key);
        }
        return photo.key;
    }

    private keyToUrl(key: string) {
        return `${API_URL}:${PORT}/upload/${key}/presignedUrl`;
    }

    public async getPresignedUrl(key: string): Promise<string> {
        if (!key) {
            return '';
        }
        const url = s3.getSignedUrl('getObject', {
            Expires: 60 * 60 * 24,
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key
        });

        return url.split('?').at(0);
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
