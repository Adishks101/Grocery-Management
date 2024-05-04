import express, { Express, Request, Response, NextFunction } from 'express';
// import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import sequelize from './utility/sqlConnection';
const app: Express = express();

app.use(bodyParser.json());

// app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
(async () => {
  await sequelize.sync({ force: false });
  console.log('Database synchronized');
})();
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



export default app;
