const Joi = require('joi');

const UserSchema = Joi.object({
        id: Joi.number().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message("'Password' Should not contain other than uppercase , lowercase letters and numbers"),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobile: Joi.string().regex(/^[0-9]{10}$/).message(`Phone number must have 10 digits.`).required(),
        address: Joi.string().optional(),
        profession: Joi.string().optional(),
        userRole: Joi.any().valid('admin','user').optional()
})

const loginSchema = UserSchema.fork(['id','firstName','lastName','mobile','address','profession','userRole'],()=>Joi.any().strip())
                                
const signupSchema = UserSchema.fork(['id','userRole'],()=>Joi.any().strip())

const createUserSchema = UserSchema.fork(['id'],()=>Joi.any().strip());

const updateUserSchema = UserSchema.fork(['id','password'],()=>Joi.any().strip());
const listAPISchema = Joi.object({
    pageSize: Joi.number(),
    pageNo: Joi.number()
})

module.exports = {
    loginSchema, signupSchema,createUserSchema,updateUserSchema, listAPISchema
}
