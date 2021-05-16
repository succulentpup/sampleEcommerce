import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { incomingEventLogger, onErrorHandler } from 'helpers/middleware';
import middy from 'middy';
import {
    cors,
    httpEventNormalizer,
    httpHeaderNormalizer,
    httpSecurityHeaders,
    validator,
} from 'middy/middlewares';
import status from 'statuses';

const WHITE_SPACES = 2;
export const health: APIGatewayProxyHandler = async (event, _context) => {
    Log.info('Add your implementation here');
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: 'Go Serverless, Your function executed successfully!',
            input: event,
        }, null, WHITE_SPACES),
    });
};
// -----------------------------------------------------------------------------------//
// ----------------------------Middy middleware---------------------------------------//
// -----------------------------------------------------------------------------------//

const inputSchema = {
    type: 'object',
    properties: {
        pathParameters: {
            type: [ 'object', 'null' ],
            properties: {
                uid: { type: 'number' },
            },
            // required: ['uid'], // Insert here all required pathParameters
        },
    },
};

export const handler = middy(health)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
