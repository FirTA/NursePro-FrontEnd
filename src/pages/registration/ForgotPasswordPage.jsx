import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

// Custom styled components
const ForgotPasswordContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  padding: theme.spacing(2),
}));

const ForgotPasswordCard = styled(Paper)(({ theme }) => ({
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

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      // const response = await API.post("forgot-password/", { email });

      setSuccess(true);
      setIsSnackbarOpen(true);
    } catch (err) {
      const errorMessage = 
        err.response?.data?.detail || "Failed to send reset link. Please try again.";
      setError(errorMessage);
      setIsSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <ForgotPasswordContainer>
      <Container component="main" maxWidth="sm">
        <ForgotPasswordCard elevation={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLogin}
            sx={{ alignSelf: "flex-start", mb: 2 }}
          >
            Back to Login
          </Button>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Reset Password
          </Typography>

          {!success ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>

              <StyledForm onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                  helperText={error}
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
                    "Send Reset Link"
                  )}
                </Button>
              </StyledForm>
            </>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
                Check your email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                We have sent a password reset link to{" "}
                <Box component="span" sx={{ fontWeight: "medium" }}>
                  {email}
                </Box>
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleBackToLogin}
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </ForgotPasswordCard>
      </Container>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success
            ? "Password reset link sent successfully!"
            : error}
        </Alert>
      </Snackbar>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;