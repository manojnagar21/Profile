import express, { Express } from 'express';
import routes from './routes';
import setupSwaggerDocs from './swagger';

const app: Express = express();

app.use(express.json());


// Setup Swagger
setupSwaggerDocs(app);

app.use('/api', routes);

export default app;