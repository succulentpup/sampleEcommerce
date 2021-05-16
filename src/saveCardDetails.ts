import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { incomingEventLogger, onErrorHandler } from 'helpers/middleware';
import middy from 'middy';
import {
    cors,
    httpEventNormalizer,
    httpHeaderNormalizer,
    httpSecurityHeaders,
    jsonBodyParser,
    validator,
} from 'middy/middlewares';
import status from 'statuses';

const WHITE_SPACES = 2;
export const saveCardDetails: APIGatewayProxyHandler = async (event, _context) => {
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
        body: {
            type: 'object',
            properties: {
                creditCardNumber: { type: 'string', minLength: 12, maxLength: 19 }, // we can add patterns to restrict the input values
                expiryMonth: { type: 'integer', minimum: 1, maximum: 12 },
                expiryYear: { type: 'integer', minimum: 2017, maximum: 2027 },
                cvc: { type: 'string', minLength: 3, maxLength: 4 },
                nameOnCard: { type: 'string' },
                amount: { type: 'number' },
            },
            required: ['creditCardNumber'], // Insert here all required event properties
        },
    },
};

export const handler = middy(saveCardDetails)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(jsonBodyParser()) // Parses the request body to json object
    .use(validator({ inputSchema })) // Validates the input
    .use(cors())
    .use(httpSecurityHeaders()); // handles common http errors and returns proper responses

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
