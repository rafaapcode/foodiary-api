import { Meal } from '@application/entities/Meal';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client } from '@infra/clients/s3Client';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutesToSeconds } from '@shared/utils/minutesToSeconds';
import { randomUUID } from 'crypto';

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly appConfig: AppConfig) {}

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
    const ext = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg';
    const fileName = `${randomUUID()}.${ext}`;

    return `${accountId}/${fileName}`;
  }

  async createPOST({
    file,
    mealId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const { key, inputType, size } = file;

    const bucket = this.appConfig.storage.s3.mealsBucket;
    const contentType =
      inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: key,
      Expires: minutesToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', size, size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');
    return {
      uploadSignature,
    };
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  };

  export type CreatePOSTParams = {
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    };
    mealId: string;
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
}
