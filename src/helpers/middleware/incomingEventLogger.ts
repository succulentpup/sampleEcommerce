import Log from '@dazn/lambda-powertools-logger';

export const incomingEventLogger = (eventHandler, next) => {
    Log.info('Incoming Event: ', { ...eventHandler.event });
    next();
};
