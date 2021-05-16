import Log from '@dazn/lambda-powertools-logger';
import got from 'got';

describe('Health end point functionality', () => {
    it('should return success response', async () => {
        // todo: how to extract-out the DNS so that no need to change it whenever there is a change in domain name
        // const response = await got('https://api.aspirex.in/health');
        const { body: { message } } = (await got('https://05dl3t8rbf.execute-api.eu-west-1.amazonaws.com/dev/getAll', {
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:' , { message });
        expect(message).toBeTruthy();
    });
});
