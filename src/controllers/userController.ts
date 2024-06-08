import { Request, Response, Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import { getCachedUser, setCachedUser, getCachedUsers, setCachedUsers } from '../helpers/cacheHelper';
import { ObjectId } from 'mongodb';
import { createUserSchema, getUserSchema, loginUserSchema } from '../schemas/userSchema';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { MongoRepository } from 'typeorm';

import { generateToken } from '../helpers/jwtHelper';
import { authenticateToken } from '../middleware/authMiddleware';

const userController: Router = Router();
const userRepository: MongoRepository<User> = AppDataSource.getMongoRepository(User);



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - mobile
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         mobile:
 *           type: string
 *           description: The mobile number of the user
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: StrongPass123!
 *         mobile: "+1234567890"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// Create a new user
userController.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password, mobile } = createUserSchema.parse(req.body);


        const whereCondition = {
            $or: [{ email }, { mobile }]
        };

        const existingUser = await userRepository.findOne({ where: whereCondition });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or mobile number already in use' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User(name, email, password, mobile);
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.mobile = mobile;

        const savedUser = await userRepository.save(user);
        delete (savedUser as { password?: string }).password;
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// Get a user by ID
userController.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = getUserSchema.parse(req.params);

        const cachedUser = await getCachedUser(id);

        if (cachedUser) {
            return res.json(JSON.parse(cachedUser));
        }

        // const user = await userRepository.findOneBy({ _id: new ObjectId(id) });

        const user = await userRepository.findOne({
            where: { _id: new ObjectId(id) },
            select: ["_id", "name", "email", "mobile"] // Exclude the password field
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


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
userController.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = loginUserSchema.parse(req.body);

        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protect all user routes
userController.use(authenticateToken);

export { userController };