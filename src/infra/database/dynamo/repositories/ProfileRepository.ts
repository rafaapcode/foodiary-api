import { Profile } from '@application/entities/Profile';
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {
  constructor(private readonly appConfig: AppConfig){}

  getPutCommand(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);
    return {
      TableName: this.appConfig.database.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void>{
    await dynamoClient.send(new PutCommand(this.getPutCommand(profile)));
  }

  async findByAccountId(accountId: string): Promise<Profile | null>{
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });

    const { Item: profileItem } = await dynamoClient.send(command);

    if(!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }

  async save(profile: Profile): Promise<void>{
    const profileItem = ProfileItem.fromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.appConfig.database.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression: 'SET #name = :name, #birthDate = :birthDate, #height = :height, #gender = :gender, #weight = :weight',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthDate': 'birthDate',
        '#height': 'height',
        '#gender': 'gender',
        '#weight': 'weight',
      },
      ExpressionAttributeValues: {
        ':name': profileItem.name,
        ':birthDate': profileItem.birthDate,
        ':height': profileItem.height,
        ':gender': profileItem.gender,
        ':weight': profileItem.weight,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

}
