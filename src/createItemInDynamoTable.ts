import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { standardOutputSchema as outputSchema } from 'helpers/inputOrOuputSchemas/outputSchemas';
import { incomingEventLogger, onErrorHandler } from 'helpers/middleware';
import middy from 'middy';
import {
    cors,
    httpEventNormalizer,
    httpHeaderNormalizer,
    httpSecurityHeaders, jsonBodyParser,
    validator,
} from 'middy/middlewares';
import status from 'statuses';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const WHITE_SPACES = 2;
const { TABLE_NAME } = process.env;

interface Body {
    body: {
        pk: string;
        sk: string;
    };
}

export const createItemInDynamoTable: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent & Body, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    const { pk, sk } = event.body!;
    const params = {
        Item: {
            pk,
            sk,
        },
        TableName: TABLE_NAME!,
    };
    const putResult = await dynamoDB.put(params).promise();
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: JSON.stringify(putResult),
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
                pk: { type: 'string', minLength: 1 },
                sk: { type: 'string', minLength: 1 },
            },
            required: ['pk', 'sk'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(createItemInDynamoTable)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(jsonBodyParser()) // Parses the request body to json object
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
