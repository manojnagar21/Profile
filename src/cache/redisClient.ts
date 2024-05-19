import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../config/config';

class RedisClient {
    private static instance: ReturnType<typeof createClient>;

    private constructor() { }

    public static getInstance(): ReturnType<typeof createClient> {
        if (!RedisClient.instance) {
            RedisClient.instance = createClient({
                url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
                password: REDIS_PASSWORD
            });

            RedisClient.instance.on('connect', () => {
                console.log('Connected to Redis');
            });

            RedisClient.instance.on('error', (err) => {
                console.error('Redis error:', err);
            });

            (async () => {
                try {
                    await RedisClient.instance.connect();
                } catch (err) {
                    console.error('Error connecting to Redis:', err);
                }
            })();
        }

        return RedisClient.instance;
    }
}

export default RedisClient.getInstance();