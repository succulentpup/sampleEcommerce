export const standardOutputSchema = {
    properties: {
        body: { type: 'string' }, // JSON
        headers: { type: 'object' },
        statusCode: { type: 'number' },
    },
    required: ['body', 'headers', 'statusCode'],
    additionalProperties: false,
};
