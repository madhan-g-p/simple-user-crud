import React, { useContext } from "react";
import { Outlet,  } from "react-router-dom";
import { AuthContext } from "../AuthStore/store";
import { Navigate } from "react-router-dom";

const VerifyAuth = () => {

    const {token} = useContext(AuthContext);

    if(!token){
        return <Navigate to="/login"  replace/>
    }else{
        return <Outlet />
    }
}

export default VerifyAuth;