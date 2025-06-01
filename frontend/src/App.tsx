import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import OrderBook from './components/OrderBook';
import OrderForm from './components/OrderForm';
import TradeHistory from './components/TradeHistory';
import Auth from './components/Auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Order Book
              </Typography>
            </Toolbar>
          </AppBar>
          <Auth onAuthSuccess={handleAuthSuccess} />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Order Book
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, mb: 4 }}>
          <OrderForm />
        </Box>

        <Box sx={{ mb: 4 }}>
          <OrderBook />
        </Box>

        <Box sx={{ mb: 4 }}>
          <TradeHistory />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
