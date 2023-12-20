import { Box, Button, Container, CssBaseline, Grid, TextField, TextareaAutosize, Typography,Link, FormLabel } from "@mui/material";
import React, { Fragment, useState } from "react";
import { fetchData } from "../API/api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const [signUpForm, setSignUpForm] = useState({});
    const [responseMessage,setResponseMessage] = useState({status: "green",msg: {common: ""}});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpForm((prev) => ({ ...prev, [name]: value }));
    }
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(`http://localhost:5000/auth/signup`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpForm)
        }).then((response)=>{
            if(response.msg === "SUCCESS"){
                setResponseMessage({status: "green",msg: {common: "Registration done Successfully"}});
               setTimeout(()=> navigate('/login'),2000);
            }else{
                setResponseMessage({status:"red",msg: {...response.detail}})
            }
        }).catch(console.log)
    }

    return (<Fragment>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={handleChange}
                                value={signUpForm.firstName}
                            />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.firstName}</FormLabel>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                onChange={handleChange}
                                value={signUpForm.lastName}
                            />
                         <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.lastName}</FormLabel>                           
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                                value={signUpForm.email}
                            />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.email}</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="mobile"
                                label="Mobile Number"
                                name="mobile"
                                type="text"
                                onChange={handleChange}
                                value={signUpForm.mobile}
                            />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.mobile}</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={handleChange}
                                value={signUpForm.password}
                            />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.password}</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="profession"
                                label="Profession"
                                id="profession"
                                onChange={handleChange}
                                value={signUpForm.profession}
                            />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.profession}</FormLabel>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize minRows={5} style={{width:"390px",minWidth:"390px"}} aria-label="minimum height" 
                            placeholder="Address" name="address" 
                            onChange={handleChange} value={signUpForm.address} />
                        <FormLabel sx={{color:responseMessage.status}}>{responseMessage.msg.address}</FormLabel>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link  href="#/login" id="login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                    <FormLabel sx={{color:responseMessage.status}}>
                        {responseMessage.msg.common}&nbsp;
                    </FormLabel>
                </Box>
            </Box>
        </Container>
    </Fragment>)
}

export default SignUp;