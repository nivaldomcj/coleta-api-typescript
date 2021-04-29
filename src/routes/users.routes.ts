import { hash } from 'bcryptjs';
import { Router } from 'express';
import knex from '../database/connection';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
    const users = await knex('users').select('*');
    
    return res.json(users);
});

usersRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHashed = await hash(password, 8);
    const user = { name, email, password: passwordHashed };

    const newID = await knex('users').insert(user);
    
    return res.json({ name, email });
});

export default usersRouter;