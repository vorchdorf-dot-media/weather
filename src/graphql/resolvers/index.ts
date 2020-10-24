import { APIGatewayProxyEvent } from 'aws-lambda';

import { parse } from 'basic-auth';

export const Query = {
  hello: (parent: any, args: any, context: { event: APIGatewayProxyEvent }): string => {
    const { headers: { authorization } } = context.event;
    console.log(parse(authorization));
    return 'Hello, world!';
  },
}

export default {
  Query
}