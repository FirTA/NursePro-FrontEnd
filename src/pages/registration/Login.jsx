import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";

import { users } from '../../data/data'
import {API} from '../../api/post';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [user, setUser ] =useState({email : "", username : ""}) 
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState();
  const [responseMsg, setResponseMsg] = useState();


  const handleSignIn = (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page
    navigate('/dashboard'); // Navigates to the dashboard route
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Make sure this is here
    try {
        await authenticateUser();
    } catch (error) {
        console.error('Submit error:', error);
    }
};


  // using api
  const authenticateUser = async () => {
    // Create an abort controller for timeout handling
    const controller = new AbortController();
    
    try {
        const data = {
            username: username,
            password: password,
        };

        console.log('Attempting login with data:', data);
        
        const response = await API.post('login/', data, {
            signal: controller.signal,
            // Add validateStatus to see all responses
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });

        if (response.status === 200) {
            console.log('Login successful:', response.data);
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            navigate('/dashboard');
        } else {
            console.error('Server responded with:', response.status, response.data);
        }
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error Details:');
            console.error('Message:', error.message);
            console.error('Response:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            console.error('Request Config:', error.config);
        } else {
            console.error('Non-Axios Error:', error);
        }
    } finally {
        controller.abort(); // Clean up
    }
  };
  const test = () =>{
  axios.get('http://127.0.0.1:8000/api/nurses/')
    .then(res => {
      let data = res.data;
      // console.log(data)
      this.setState({
        details: data
      });
    })
    .catch(err => { })
  }
  // using local data
// const authenticateUser = (email, password) =>{
//   const user = users.find((user) => user.email === email);
//   if (!user){
//     console.log("User not found")
//     return { success: false, message : "User not found"}
//   }
//   if (password === "password123") { // For simplicity, all users have the same password
//     return { success: true, user };
//   }



//   console.log("incorrect password")
//   return { success: false, message: "Invalid credentials" };
// }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Button onClick={()=>test()}>
            test
          </Button>
          <form className={classes.form} onSubmit={(e)=>handleSubmit(e)} >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => {
                  setUsername(e.target.value)
                  console.log(username)
                }
              }
              value={username}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}

            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}></Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
