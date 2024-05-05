import express, { Express, Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import sequelize from './utility/sqlConnection';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import groceryRoutes from './routes/groceryRoutes';

const app: Express = express();
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api',authRoutes);
(async () => {
  await sequelize.sync({ force: false });
  console.log('Database synchronized');
})();
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
