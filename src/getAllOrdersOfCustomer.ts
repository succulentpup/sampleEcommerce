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

export const getAllOrdersOfCustomer: APIGatewayProxyHandler = async (event, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    const { customerId } = event.pathParameters as { customerId: string };
    const params = {
        ExpressionAttributeValues: {
            ':pk': `CUSTOMER:${customerId}`,
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
    const [ , ...productsInTheOrder ] = queryResult.Items!; // this could have been handled better, but for this exercise assumed we do have items
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: productsInTheOrder,
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
                customerId: { type: 'string', minLength: 6 },
            },
            required: ['customerId'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(getAllOrdersOfCustomer)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
