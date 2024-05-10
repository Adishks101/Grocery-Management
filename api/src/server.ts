import express, { Express, Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import bodyParser from "body-parser";
import sequelize from "./utility/sqlConnection";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import groceryRoutes from "./routes/groceryRoutes";
import cookieParser from "cookie-parser";
import { CustomError } from "./utility/middleware/errorHandler";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import fs from "fs"

const app: Express = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join( 'public',)));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

// Logging middleware
morgan.token('custom', (req: Request, _res: Response) => {
  const { method, url, body, query, headers } = req;
  const userId = req.cookies?.id || 'N/A'; 

  return JSON.stringify({
    method,
    url,
    body,
    query,
    headers,
    userId,
  });
});

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :custom', { stream: accessLogStream }));

// routes
app.use("/api/user", userRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", authRoutes);

(async () => {
  await sequelize.sync({ alter: true });
  console.log("Database synchronized");
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
