import React, { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, CssBaseline, Typography, Grid, Button,
    TextField, Link, FormLabel
} from "@mui/material";
import { AuthContext } from "../AuthStore/store";
import { fetchData } from "../API/api";

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })
    const [response, setResponse] = useState({
        status: "info", msg: { common: "" }
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData('http://localhost:5000/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginForm)
        }).then((response) => {
            if (response.msg === 'SUCCESS') {
                setResponse({ status: "green", msg: { common: "Logged in successfully" } })
                
                setTimeout(() => {
                    setAuth({...response.asset,isAdmin: response.asset.userRole === 'admin'});
                    navigate('/dashboard', { replace: true });
                }, 2000);

            } else {
                setResponse({ status: "red", msg: { ...response.detail } })
            }
        })
            .catch((err) => console.log(err, "ERR"))
    }

    return (
        <Fragment>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChange}
                            value={loginForm.email}
                        />
                        <FormLabel sx={{ color: response.status }}>
                            {response.msg["email"]} &nbsp;
                        </FormLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            value={loginForm.password}
                        />
                        <FormLabel sx={{ color: response.status }}>
                            {response.msg["password"]} &nbsp;
                        </FormLabel>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>

                            <Grid item>
                                <Link href="#/signup" id="signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <FormLabel sx={{ color: response.status }}>{response.msg.common}</FormLabel>
                </Box>
            </Container>
        </Fragment>
    )
}

export default Login;