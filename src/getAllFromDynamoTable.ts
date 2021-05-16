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

export const getAllFromDynamoTable: APIGatewayProxyHandler = async (event, _context) => {
    Log.debug('Dynamo Table name', { TABLE_NAME });
    const params = {
        TableName: TABLE_NAME!,
    };
    // recursive scan is not implemented for keeping this template simple
    const scanResult = await dynamoDB.scan(params).promise();
    Log.debug('scanResult: ', { scanResult });
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: JSON.stringify(scanResult.Items),
            input: event, // used it to avoid a lint error of not using event, in practice don't return event in response
        }, null, WHITE_SPACES),
    });
};
// -----------------------------------------------------------------------------------//
// ----------------------------Middy middleware---------------------------------------//
// -----------------------------------------------------------------------------------//

const inputSchema = {
    type: 'object',
    properties: { }, // add input schema here
};

export const handler = middy(getAllFromDynamoTable)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
