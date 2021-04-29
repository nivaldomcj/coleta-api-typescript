import { response, Router } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import knex from '../database/connection';
import authConfig from '../config/auth';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await knex('users').where('email', email).first();

    if (!user) {
        return res.status(400).json({
            message: 'Incorrect credentials. Please try again'
        });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: 'Incorrect credentials. Please try again'
        });
    }

    const token = sign({}, authConfig.jwt.secret, {
        subject: String(user.id),
        expiresIn: authConfig.jwt.expiresIn
    });

    return res.json({ email, token });
});

export default sessionsRouter;