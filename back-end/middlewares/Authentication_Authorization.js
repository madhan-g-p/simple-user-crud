require('dotenv').config();
const jwt = require("jsonwebtoken");
const pool = require('../dbConnection/db');
const {sendRes} =  require("../utilities/helperFunctions");

const authentication  = async(req,res,next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
			let resTmpt={};
			resTmpt.msg = "failure";
			resTmpt.desc = "no token";
		    return	res.status(401).send(resTmpt);
		}
        
        const payload = jwt.verify(jwtToken, process.env.JWT_TOKEN);
		req.uuid = payload.uuid;

        let qryForRole = await pool.query(`SELECT * FROM users.user_data WHERE uuid = $1`,[req.uuid]);
        req.role = qryForRole.rows[0].user_role;

        next();
    } catch (error) {
        return sendRes(res, 403, "invalid token", error, null);
    }
}

const authorization = (roleRequired)=>{
    return (req,res,next)=>{
        if(req.role === roleRequired){
            next();
        }else{
            return sendRes(res,403,`Only ${roleRequired} can access this`,null)
        }
    }
}
module.exports = {
    authentication, 
    authorization
}