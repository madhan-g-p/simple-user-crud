const router = require("express").Router();
const pool = require("../../dbConnection/db");
const { finalValidator, sendRes } = require("../../utilities/helperFunctions");
const { loginSchema,signupSchema } = require("../../utilities/validatorSchemas");
const { authSQL } = require("./sqlConstants");

router.post('/signup',finalValidator(signupSchema),async(req,res,next)=>{
    
    const client = await pool.connect();
    await authSQL.signupQuery(client,req.body)
            .then((asset)=>sendRes(res,200,"Signed Up successfully",null,asset))
            .catch(async(err)=>{await client.query('ROLLBACK');next(err)})
            .finally(()=>client.release());

});


router.post('/login',finalValidator(loginSchema),async(req,res,next)=>{
    
    let {email,password} = req.body;
    const params = [email,password];
    const client = await pool.connect();
    await authSQL.loginQuery(client,params)
            .then((asset)=>sendRes(res,200,"Logged In successfully",null,asset))
            .catch(next)
            .finally(()=>client.release());

});

module.exports = router;