import Joi from 'joi';

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
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
  address: Joi.string().required(),
  phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
  dob: Joi.date().iso().required(),
  gender: Joi.string().valid(...Object.values(Gender)).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
  userType: Joi.string().valid(...Object.values(UserType)).required(),
  address: Joi.string().required(),
  phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
  dob: Joi.date().iso().required(),
  gender: Joi.string().valid(...Object.values(Gender)).required(),
});
const updateUserSchemaSelf = Joi.object({
name: Joi.string().required(),
password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{}[\]|;:'",.<>?`~])[A-Za-z\d!@#$%^&*()-_=+{}[\]|;:'",.<>?`~]{8,}$/),
address: Joi.string().required(),
phone: Joi.string().allow(null, '').pattern(/^\+?\d{1,3}[- ]?\d{10}$/).optional(),
dob: Joi.date().iso().required(),
gender: Joi.string().valid(...Object.values(Gender)).required(),
});

export  {userSchema,userSchemaSelf,updateUserSchemaSelf,updateUserSchema};

