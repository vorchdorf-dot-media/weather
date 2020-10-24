import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';

import graphQlHandler from '../graphql';

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context, callback: Callback<APIGatewayProxyResult>): void | Promise<APIGatewayProxyResult> => {
  const { httpMethod } = event;

  switch (httpMethod) {
    case 'DELETE':
    case 'PATCH':
    case 'PUT':
      return Promise.resolve({
        statusCode: 405,
        body: 'Method Not Allowed',
        headers: {
          Allow: 'GET,POST,HEAD'
        }
      });
    default:
      return graphQlHandler(event, context, callback);
  }
}