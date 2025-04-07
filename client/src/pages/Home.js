import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box
} from '@mui/material';
import {
  AccountBalanceWallet,
  Send,
  History,
  Security
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Digital Wallet',
      description: 'Store and manage your money securely in your digital wallet',
      icon: <AccountBalanceWallet fontSize="large" />,
      action: user ? 'Go to Dashboard' : 'Register Now',
      path: user ? '/dashboard' : '/register'
    },
    {
      title: 'Send Money',
      description: 'Transfer money instantly to anyone using their phone number',
      icon: <Send fontSize="large" />,
      action: user ? 'Send Money' : 'Login to Send',
      path: user ? '/send-money' : '/login'
    },
    {
      title: 'Transaction History',
      description: 'View your complete transaction history with detailed records',
      icon: <History fontSize="large" />,
      action: user ? 'View History' : 'Login to View',
      path: user ? '/transactions' : '/login'
    },
    {
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-grade security',
      icon: <Security fontSize="large" />,
      action: user ? 'Learn More' : 'Register Now',
      path: user ? '/dashboard' : '/register'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to PayTM Clone
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Your one-stop solution for digital payments and money transfers
        </Typography>
        {!user && (
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box color="primary.main" mb={2}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 