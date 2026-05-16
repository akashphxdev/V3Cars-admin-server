import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import corsOptions from '@/config/cors';
import router from '@/routes/index';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/admin/v1', router);

export default app;