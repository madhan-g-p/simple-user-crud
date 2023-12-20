const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const {convertUnderScoresToCamelCase} = require("../../utilities/helperFunctions");

const authSQL = {
    loginQuery: async(client,payload) => {
        let dbResponse = await client.query(`SELECT * FROM users.user_data
                                            WHERE email::citext = $1`,[payload[0]]);

            if(dbResponse.rowCount){

                const { user_role,salted_password,uuid} = dbResponse.rows[0];
                // login success case
                const isPasswordMatching = await bcrypt.compare(payload[1],salted_password);
                
                if(isPasswordMatching){
                    const token = jwt.sign({uuid},process.env.JWT_TOKEN,{
                        expiresIn: "5d"
                    })
                    return {
                        userRole:user_role,token,
                    }

                //invalid password case
                }else{
                    throw invalidPasswordObj
                }

                //user not registered case
            }else{
                throw unregisteredUserObj
            }
    },
    signupQuery: async(client,payload) => {

        const SALT_CONFIG = await bcrypt.genSalt(10);
        const SALTED_PASSWORD = await bcrypt.hash(payload.password,SALT_CONFIG);
        
        const {firstName,lastName,email,mobile,address,profession,userRole} = payload;

        let params = [firstName,lastName,email,mobile,address,profession,SALTED_PASSWORD,userRole || "user"];
        await client.query('BEGIN');
        let dbResponse = await client.query(`INSERT INTO users.user_data 
                                            (first_name,last_name,email,mobile,address,profession,salted_password,user_role)
                                            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,params)
                                            .catch((err)=>{
                                                // duplicate mobile or email error handled
                                                if(err.detail?.includes("already exists")){
                                                    throw duplicateUserObj;
                                                }else{
                                                    throw err;
                                                }
                                            });  
        if(dbResponse?.rowCount){
            await client.query('COMMIT');
            const {salted_password,...rest} = dbResponse.rows[0];
            return {
                ...convertUnderScoresToCamelCase(rest)
            }
        }
    }
}

const invalidPasswordObj = {
    message: "failure",
    statusCode: 403,
    detail: {common: "Password Doesn't match"},
    path: "Error in User Login",
  };

const unregisteredUserObj= {
    message: "failure",
    statusCode: 401,
    detail: {common:  "This Email is Not Registered"},
    path: "Error in User Login",
}

const duplicateUserObj = {
    message: "conflict",
    statusCode: 409,
    detail: {common: "User Email or User Mobile Already Registered"},
    path: "Error in User Registration",
}

module.exports = {
    authSQL
}