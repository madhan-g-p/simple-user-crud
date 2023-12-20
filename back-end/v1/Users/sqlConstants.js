const {convertUnderScoresToCamelCase} = require("../../utilities/helperFunctions");

const usersSQL = {
    getUsers: async(client,params)=>{
       let dbResponse = await client.query(`SELECT * FROM users.user_data
                            LIMIT $1 OFFSET $2`,params);
            if(dbResponse.rowCount){
                return dbResponse.rows.map(({salted_password,uuid,created_time,edited_time,...rest})=>convertUnderScoresToCamelCase(rest))
            }
    },
    updateUser: async(client,params,id)=>{
        let dbResponse = await client.query(`UPDATE users.user_data SET
                                                first_name = $1,last_name =$2,
                                                email = $3, mobile = $4,
                                                user_role = $5,address = $6,profession = $7
                                                WHERE id = $8
                                                RETURNING *`,[...params,id]);
        if(dbResponse.rowCount){
            await client.query('COMMIT');
            return dbResponse.rows.map(convertUnderScoresToCamelCase)
        }else{
            throw userNotFoundObj('EDIT')
        }
    },
    deleteUser: async(client,id)=>{
        let dbResponse = await client.query(`DELETE FROM users.user_data WHERE id = $1 RETURNING *`,[id]);

        if(dbResponse.rowCount){
            await client.query('COMMIT');
            return dbResponse.rows.map(convertUnderScoresToCamelCase);
        }else{
            throw userNotFoundObj('DELETE');
        }
    }
}

const userNotFoundObj= (method)=>({
    message: "failure",
    statusCode: 400,
    detail: {common: "User Id Not Found, Cannot be accessed"},
    path: `Error in User ${method} API`,
})

module.exports = {
    usersSQL
}