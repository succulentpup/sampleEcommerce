import Log from '@dazn/lambda-powertools-logger';
import status from 'statuses';

export const onErrorHandler = (eventHandler, next) => {
    Log.error('Error: ', eventHandler.error);
    const stringifiedError = JSON.stringify(eventHandler.error);
    const errorMessage = stringifiedError === '{}' ? eventHandler.error.message : stringifiedError;
    const errorStatus = eventHandler.error.name === 'BadRequestError' ? 'Bad Request' : 'Internal Server Error';
    eventHandler.response =  ({
        statusCode: status(errorStatus) as number,
        body: errorMessage,
    });
    next();
};
