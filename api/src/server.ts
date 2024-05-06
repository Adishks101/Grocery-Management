import express, { Express, Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import sequelize from './utility/sqlConnection';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import groceryRoutes from './routes/groceryRoutes';
import cookieParser from 'cookie-parser';
import { CustomError } from './utility/middleware/errorHandler';

const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api',authRoutes);
(async () => {
  await sequelize.sync({ force: false });
  console.log('Database synchronized');
})();
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
