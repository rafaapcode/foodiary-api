import { Injectable } from '@kernel/decorators/Injectable';
import { env } from './env';

@Injectable()
export class AppConfig {
  public readonly auth: AppConfig.Auth;
  public readonly database: AppConfig.Database;
  public readonly storage: AppConfig.Storage;
  public readonly cdn: AppConfig.Cdns;
  public readonly queues: AppConfig.Queues;

  constructor() {
    this.auth = {
      cognito: {
        client: {
          id: env.COGNITO_CLIENT_ID,
          secret: env.COGNITO_CLIENT_SECRET,
        },
        poll: {
          id: env.COGNITO_POOL_ID,
        },
      },
    };

    this.database = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      s3: {
        mealsBucket: env.MEALS_BUCKET,
      },
    };

    this.cdn = {
      meals_cdn: env.MEALS_CDN_DOMAIN_NAME,
    };

    this.queues = {
      meals_queue_url: env.MEALS_QUEUE_URL,
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      client: {
        id: string;
        secret: string;
      }
      poll: {
        id: string;
      }
    };
  };

   export type Database = {
    dynamodb: {
      mainTable: string;
    };
  };
  export type Storage = {
    s3: {
      mealsBucket: string;
    };
  };

  export type Cdns = {
    meals_cdn: string
  };

  export type Queues = {
    meals_queue_url: string
  };
}
