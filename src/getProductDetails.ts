import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { standardOutputSchema as outputSchema } from 'helpers/inputOrOuputSchemas/outputSchemas';
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

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const WHITE_SPACES = 2;
const { TABLE_NAME } = process.env;

export const getProductDetails: APIGatewayProxyHandler = async (event, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    const { productId: pk } = event.pathParameters as { productId: string };
    Log.debug('productId: ', { pk });
    const params = {
        Key: {
            pk,
            sk: `DETAILS:${pk}`,
        },
        TableName: TABLE_NAME!,
    };
    // todo: pagination is not handled for this exercise
    const queryResult = await dynamoDB.get(params).promise();
    Log.debug('queryResult: ', { queryResult });
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: queryResult.Item,
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
            type: 'object',
            properties: {
                productId: { type: 'string', minLength: 6 },
            },
            required: ['productId'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(getProductDetails)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
