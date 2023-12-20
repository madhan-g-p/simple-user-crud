const router = require("express").Router();
const pool = require("../../dbConnection/db");
const { authentication, authorization } = require("../../middlewares/Authentication_Authorization");
const { finalValidator, sendRes } = require("../../utilities/helperFunctions");
const { signupSchema, listAPISchema } = require("../../utilities/validatorSchemas");
const { authSQL } = require("../Authentication/sqlConstants");
const { usersSQL } = require("./sqlConstants");


router.post("/",authentication,authorization("admin"),async(req,res,next)=>{
    const client = await pool.connect();
    await authSQL.signupQuery(client,req.body)
            .then((asset)=>sendRes(res,200,"Created New User successfully",null,asset))
            .catch(async(err)=>{await client.query('ROLLBACK');next(err)})
            .finally(()=>client.release());
})


router.get("/", authentication,finalValidator(listAPISchema), async (req, res, next) => {
    let { pageNo, pageSize } = req.query;
    pageNo = (pageNo - 1) * pageSize;
    
    const client = await pool.connect();
    await usersSQL.getUsers(client,[pageSize, pageNo],req.role)
        .then((asset) => sendRes(res, 200, "Successfully fetched", null, asset))
        .catch(next)
        .finally(() => client.release());
});

router.put("/:id", 
            authentication, 
            authorization("admin"),finalValidator(signupSchema), 
            async (req, res, next) => {
            const client = await pool.connect();
            const {firstName,lastName,email,mobile,userRole,address,profession} = req.body;

            await client.query('BEGIN');
            await usersSQL.updateUser(client, [firstName,lastName,email,mobile,userRole,address,profession], req.params.id)
                    .then((asset) => sendRes(res, 200, "Successfully updated the user", null, asset))
                    .catch(async(err)=>{await client.query('ROLLBACK'); next(err);})
                    .finally(() => client.release());
});

router.delete("/:id", authentication,authorization("admin"),async(req,res,next)=>{
    
    const client = await pool.connect();    

    await client.query('BEGIN');
    await usersSQL.deleteUser(client,req.params.id)
            .then((asset)=>sendRes(res,200,"Successfully deleted the user",null,asset))
            .catch(async(err)=>{await client.query('ROLLBACK'); next(err);})
            .finally(()=>client.release());
})


module.exports = router;