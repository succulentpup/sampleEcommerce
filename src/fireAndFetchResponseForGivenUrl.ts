import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyHandler } from 'aws-lambda';
import got from 'got';
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
export const fireAndFetchResponseForGivenUrl: APIGatewayProxyHandler = async (event, _context) => {
    const { url } = event.queryStringParameters!;
    const res = await got(url!)
        .catch((e: Error) => {
            Log.debug(`something went wrong while fetching contents from: ${url} & error: ${JSON.stringify(e, null, WHITE_SPACES)}`);
            return {
                statusCode: status('Internal Server Error') as number,
                body: JSON.stringify({
                    message: e.message,
                }, null, WHITE_SPACES),
            };
        });
    Log.debug(`res.body: ${res.body}`);
    return {
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: 'Go Serverless, Your function executed successfully!',
            result: res.body,
        }, null, WHITE_SPACES),
    };
};
// -----------------------------------------------------------------------------------//
// ----------------------------Middy middleware---------------------------------------//
// -----------------------------------------------------------------------------------//

const inputSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                url: { type: 'string' }, // todo: add regex pattern to validate url
            },
            required: ['url'],
        },
    },
    required: ['queryStringParameters'],
};

export const handler = middy(fireAndFetchResponseForGivenUrl)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders()); // handles common http errors and returns proper responses

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
