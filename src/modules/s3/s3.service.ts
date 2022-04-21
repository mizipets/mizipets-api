import {Injectable} from '@nestjs/common';
import * as AWS from 'aws-sdk';


const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class S3Service {
    constructor() {}

    async uploadFile(userId: number, file: any) {
    console.log(file);
        const image = await s3.upload({
            Bucket: AWS_S3_BUCKET_NAME,
            Body: file.buffer,
            Key: `animal_1_${file.name}`
        });
        // user = await this.getById(userId);
        // await this.usersRepository.update(userId, {
        //     ...user,
        //     avatar
        // });
        return image;
    }
}
