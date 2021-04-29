import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();

// configure CORS
// app.use(cors({
//     origin: ['example.com', 'domain.com']
// }));
app.use(cors());

// parse json requests
app.use(express.json());

// defined routes
app.use(routes);

// static routes
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

// handle errors from celebrate
app.use(errors());

app.listen(3333, () => {
    console.log('Server initialized on port 3333!')
});