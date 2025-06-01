import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Tabs,
    Tab,
    Alert,
} from '@mui/material';
import { login, register } from '../services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const Auth: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
    const [tab, setTab] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setError(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(loginData.username, loginData.password);
            onAuthSuccess();
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register(registerData.username, registerData.email, registerData.password);
            await login(registerData.username, registerData.password);
            onAuthSuccess();
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} centered>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}

            <TabPanel value={tab} index={0}>
                <form onSubmit={handleLoginSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6">Login</Typography>
                        <TextField
                            label="Username"
                            value={loginData.username}
                            onChange={(e) =>
                                setLoginData({ ...loginData, username: e.target.value })
                            }
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) =>
                                setLoginData({ ...loginData, password: e.target.value })
                            }
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>
                </form>
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <form onSubmit={handleRegisterSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6">Register</Typography>
                        <TextField
                            label="Username"
                            value={registerData.username}
                            onChange={(e) =>
                                setRegisterData({ ...registerData, username: e.target.value })
                            }
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                                setRegisterData({ ...registerData, email: e.target.value })
                            }
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={registerData.password}
                            onChange={(e) =>
                                setRegisterData({ ...registerData, password: e.target.value })
                            }
                            required
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) =>
                                setRegisterData({
                                    ...registerData,
                                    confirmPassword: e.target.value,
                                })
                            }
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Box>
                </form>
            </TabPanel>
        </Paper>
    );
};

export default Auth;
