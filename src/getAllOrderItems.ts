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

export const getAllOrderItems: APIGatewayProxyHandler = async (event, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    const { orderId } = event.pathParameters as { orderId: string };
    const params = {
        ExpressionAttributeValues: {
            ':pk': orderId,
        },
        ExpressionAttributeNames: {
            '#pk': 'pk',
        },
        KeyConditionExpression: '#pk = :pk',
        ScanIndexForward: false,
        Limit: 10, // fetching only latest 10 for this exercise
        TableName: TABLE_NAME!,
    };
    // todo: pagination is not handled for this exercise
    const queryResult = await dynamoDB.query(params).promise();
    Log.debug('queryResult: ', { queryResult });
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: queryResult.Items,
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
                orderId: { type: 'string', minLength: 6 }, // todo: regex to ensure orderId starts with ORDER
            },
            required: ['orderId'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(getAllOrderItems)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
