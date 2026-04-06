import Joi from "joi";
import { emailRegex, nameRegex } from "../config/regex";
import { UserRole } from "./userInterface";

const addUserValidator = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .regex(nameRegex)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.regex": "Invalid Characters",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must not exced 50 characters",
    }),

  email: Joi.string().trim().regex(emailRegex).required().messages({
    "string.regex": "Invalid email format",
    "string.empty": "Email is required",
  }),
  phone: Joi.object({
    country_code: Joi.string()
      .required()
      .messages({ "any.required": "Country code is required" }),
    value: Joi.string()
      .required()
      .messages({ "any.required": "Phone Number is required" }),
  }).optional(),

  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
});
const adminAddUserValidator = addUserValidator.append({
  secret: Joi.string().required().messages({
    "string.empty": "Secret is required",
  }),
  organization_name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .regex(nameRegex)
    .required()
    .messages({
      "string.empty": "Organization Name is required",
      "string.regex": "Invalid Characters",
      "string.min": "Organization Name must be at least 3 characters",
      "string.max": "Organization Name must not exced 50 characters",
    }),
  country: Joi.string()
    .trim()
    .min(2)
    .max(2)
    .regex(nameRegex)
    .required()
    .messages({
      "string.empty": "Country is required",
      "string.regex": "Invalid Characters",
      "string.min": "Country must be at least 2 characters",
      "string.max": "Country must not exced 2 characters",
    }),
  state: Joi.string()
    .trim()
    .min(2)
    .max(2)
    .regex(nameRegex)
    .required()
    .messages({
      "string.empty": "State is required",
      "string.regex": "Invalid Characters",
      "string.min": "State must be at least 2 characters",
      "string.max": "State must not exced 2 characters",
    }),
  city: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .regex(nameRegex)
    .required()
    .messages({
      "string.empty": "City is required",
      "string.regex": "Invalid Characters",
      "string.min": "City must be at least 3 characters",
      "string.max": "City must not exced 50 characters",
    }),
});

const loginUserValidator = Joi.object({
  email: Joi.string().trim().regex(emailRegex).required().messages({
    "string.regex": "Invalid email format",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),
});

export { addUserValidator, loginUserValidator, adminAddUserValidator };
