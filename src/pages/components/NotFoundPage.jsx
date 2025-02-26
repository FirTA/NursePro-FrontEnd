// pages/NotFound.js
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid 
} from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        height: 'calc(100vh - 64px)',  // Account for app bar height
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5' 
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            borderRadius: 2, 
            textAlign: 'center',
            border: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item>
              <ErrorOutlineIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#6f42c1',
                  mb: 2 
                }} 
              />
            </Grid>
            <Grid item>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 500, color: '#6f42c1' }}>
                404
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ color: '#555' }}>
                Page Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}>
                The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the dashboard.
              </Typography>
            </Grid>
            <Grid item sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={Link} 
                to="/"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  px: 4, 
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              >
                Return to Dashboard
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;