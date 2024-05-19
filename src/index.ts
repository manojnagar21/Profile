import express, { Application } from 'express';
import routes from './routes';

const app: Application = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api', routes);

export default app;