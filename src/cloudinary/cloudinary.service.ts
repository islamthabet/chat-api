import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as sharp from 'sharp';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      sharp(file.buffer)
        .resize({ width: 512, height: 512 })
        .webp()
        .toBuffer()
        .then((buffer) => {
          toStream(buffer).pipe(upload);
        });
    });
  }
}
