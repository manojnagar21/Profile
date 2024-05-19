import redisClient from '../cache/redisClient';

export const getCachedUser = async (id: string): Promise<string | null> => {
    try {
        const data = await redisClient.get(id);
        return data;
    } catch (err) {
        console.error('Error getting cached user:', err);
        return null;
    }
};

export const setCachedUser = async (id: string, data: string): Promise<void> => {
    try {
        await redisClient.set(id, data, { EX: 3600 }); // Cache expires in 1 hour
    } catch (err) {
        console.error('Error setting cached user:', err);
    }
};

export const getCachedUsers = async (): Promise<string | null> => {
    try {
        return await redisClient.get('users');
    } catch (err) {
        console.error('Error getting cached users:', err);
        return null;
    }
};

export const setCachedUsers = async (data: string): Promise<void> => {
    try {
        await redisClient.set('users', data);
    } catch (err) {
        console.error('Error setting cached users:', err);
    }
};