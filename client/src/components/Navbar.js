import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    Paytm Clone
                </Typography>

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/dashboard"
                            sx={{ mr: 2 }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/send-money"
                            sx={{ mr: 2 }}
                        >
                            Send Money
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/transactions"
                            sx={{ mr: 2 }}
                        >
                            Transactions
                        </Button>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/login"
                            sx={{ mr: 2 }}
                        >
                            Login
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/register"
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 