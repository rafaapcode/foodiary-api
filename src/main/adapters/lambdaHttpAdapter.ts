import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { lambdaBodyParser } from '../utils/lambdaBodyParser';

export function lambdaHttpAdapter(controller: any){
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const body = lambdaBodyParser(event.body);
    const params = event.pathParameters ?? {};
    const queryParams = event.queryStringParameters ??{};

    const response = await controller.handle({
      body,
      params,
      queryParams,
    });

    return {
      statusCode: response.statusCode,
      body: response.body ? JSON.stringify(response.body) : undefined,
    };
  };
}
