import { Request, Response, Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import { getCachedUser, setCachedUser, getCachedUsers, setCachedUsers } from '../helpers/cacheHelper';
import { ObjectId } from 'mongodb';
import { createUserSchema, getUserSchema } from '../schemas/userSchema';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const userController = Router();
const userRepository = AppDataSource.getMongoRepository(User);

// Create a new user
userController.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = createUserSchema.parse(req.body);


        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;

        const savedUser = await userRepository.save(user);
        delete (savedUser as {password?: string}).password;
        await setCachedUser(savedUser._id.toString(), JSON.stringify(savedUser));
        res.status(201).json(savedUser);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a user by ID
userController.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = getUserSchema.parse(req.params);

        const cachedUser = await getCachedUser(id);

        if (cachedUser) {
            return res.json(JSON.parse(cachedUser));
        }

        // const user = await userRepository.findOneBy({ _id: new ObjectId(id) });
        
        const user = await userRepository.findOne({
            where: { _id: new ObjectId(id) },
            select: ["_id", "name", "email"] // Exclude the password field
        });

        if (user) {
            await setCachedUser(user._id.toString(), JSON.stringify(user));
            return res.json(user);
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all users
userController.get('/', async (req: Request, res: Response) => {
    try {
        const cachedUsers = await getCachedUsers();

        if (cachedUsers) {
            return res.json(JSON.parse(cachedUsers));
        }

        // const users = await userRepository.find();
        const users = await userRepository.find({
            select: ["_id", "name", "email"] // Exclude the password field
        });

        await setCachedUsers(JSON.stringify(users));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { userController };