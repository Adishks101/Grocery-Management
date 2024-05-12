import Joi from 'joi';
import { UserType, Gender, Status } from '../../customDatatypes';
import { NextFunction ,Request,Response} from 'express';
import { errorHandler } from '../errorHandler';
import User from '../../../models/User';

const querySchema = Joi.object({
  name: Joi.string(),
  userType: Joi.string().valid(...Object.values(UserType)).optional(),
  gender: Joi.string().valid(...Object.values(Gender)).optional(),
  status:Joi.string().valid(...Object.values(Status)).optional(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
});

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
    userType: Joi.string().valid(...Object.values(UserType)).required(),
    address: Joi.string().required(),
    phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
    dob: Joi.date().iso().required(),
    gender: Joi.string().valid(...Object.values(Gender)).required(),
});

const userSchemaSelf = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
  address: Joi.string().required(),
  phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
  dob: Joi.date().iso().required(),
  gender: Joi.string().valid(...Object.values(Gender)).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
  userType: Joi.string().valid(...Object.values(UserType)),
  address: Joi.string(),
  phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
  dob: Joi.date().iso(),
  gender: Joi.string().valid(...Object.values(Gender)),
});
const updateUserSchemaSelf = Joi.object({
name: Joi.string().required(),
password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
address: Joi.string().required(),
phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
dob: Joi.date().iso().required(),
gender: Joi.string().valid(...Object.values(Gender)).required(),
});

const createUserCheck=async (req: Request, res: Response,next: NextFunction) => {
  
  const {error}=userSchema.validate(req.body);
  if(error){
    const errorMessages = error.details
    .map((detail) => detail.message)
    .join(", ");
  return next(errorHandler(400, errorMessages));  }
  const {email}=req.body;
const user=await User.findOne({where:{email}});
if(user){
  return next(errorHandler(400,"User with this email already exists"));
}
next()
};
const createUserSelfCheck=async (req: Request, res: Response,next: NextFunction) => {
  const {error}=userSchemaSelf.validate(req.body);
  if(error){
    const errorMessages = error.details
    .map((detail) => detail.message)
    .join(", ");
  return next(errorHandler(400, errorMessages));  }
  const {email}=req.body;
const user=await User.findOne({where:{email}});
if(user){
  return next(errorHandler(400,"User with this email already exists"));
}
next()
};

const checkQuerygetUsers=async (req: Request, res: Response,next: NextFunction) =>{
  const {error}=querySchema.validate(req.query);
  if(error){
    const errorMessages = error.details
    .map((detail) => detail.message)
    .join(", ");
  return next(errorHandler(400, errorMessages));  }
  next();
}
export  {userSchema,userSchemaSelf,updateUserSchemaSelf,updateUserSchema,createUserCheck,createUserSelfCheck,checkQuerygetUsers};

