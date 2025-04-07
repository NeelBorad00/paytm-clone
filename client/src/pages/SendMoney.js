import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton
} from '@mui/material';
import { 
  Send, 
  Phone, 
  AccountBalance, 
  Description, 
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SendMoney = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverPhone: '',
    amount: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [balance, setBalance] = useState(null);

  // Fetch balance on component mount
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBalance();
  }, [user, navigate]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/wallet/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/wallet/send-money',
        {
          receiverPhone: formData.receiverPhone,
          amount: parseFloat(formData.amount),
          description: formData.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Money sent successfully');
      setFormData({
        receiverPhone: '',
        amount: '',
        description: ''
      });
      setActiveStep(3); // Move to success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send money');
    }
  };

  const steps = ['Receiver Details', 'Amount', 'Confirm', 'Success'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Receiver's Details
            </Typography>
            <TextField
              label="Receiver's Phone Number"
              name="receiverPhone"
              fullWidth
              margin="normal"
              value={formData.receiverPhone}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Amount
            </Typography>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              fullWidth
              margin="normal"
              value={formData.amount}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Description (Optional)"
              name="description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Your current balance: ₹{balance?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Transaction
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Receiver's Phone
                    </Typography>
                    <Typography variant="body1">
                      {formData.receiverPhone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{formData.amount}
                    </Typography>
                  </Grid>
                  {formData.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {formData.description}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            <Typography variant="body2" color="text.secondary">
              Your current balance: ₹{balance?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box textAlign="center" py={4}>
            <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Money Sent Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your transaction has been completed.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Send Money
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                  ) : activeStep === steps.length - 2 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      startIcon={<Send />}
                    >
                      Send Money
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={
                        (activeStep === 0 && !formData.receiverPhone) ||
                        (activeStep === 1 && !formData.amount)
                      }
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SendMoney; 