import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import * as dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Welcome to Bar Orders API!');
});

app.listen(Number(process.env.PORT), '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});

export default app;
