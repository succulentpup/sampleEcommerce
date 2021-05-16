// todo: replace it with middy middleware i.e
// create a middy middleware to create reponse obj. This should be the last year in before and need not have after or onError
export const buildResponseObject = (statusCode: number, body: object) => ({
        statusCode,
        body: JSON.stringify(body),
    });
