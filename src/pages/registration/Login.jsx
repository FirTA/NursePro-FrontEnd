import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { API } from "../../api/post";

// Custom styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  padding: theme.spacing(2),
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 450,
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(2),
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  width: "100%",
  justifyContent: "flex-start",
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
  },
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await API.post("login/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        const { access_token, refresh_token, user_id, role } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errorMessage);
      setIsSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Container component="main" maxWidth="sm">
        <LoginCard elevation={3}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Welcome Back
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Please sign in to your account
          </Typography>

          <StyledForm onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="username"
              name="username"
              autoFocus
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                position: "relative",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ position: "absolute" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/forgot-password" variant="body2" color="primary">
                  Forgot password?
                </Link>
              </Grid>
            </Grid> */}

            {/* <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link href="/signup" color="primary" fontWeight="medium">
                  Sign up
                </Link>
              </Typography>
            </Box> */}
          </StyledForm>
        </LoginCard>
      </Container>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </LoginContainer>
  );
};

export default LoginPage;
