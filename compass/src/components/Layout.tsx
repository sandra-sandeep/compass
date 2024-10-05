import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Journal App
          </Typography>
          <Link href="/login" passHref>
            <Typography component="a" sx={{ color: 'white', textDecoration: 'none', mr: 2 }}>
              Login
            </Typography>
          </Link>
          <Link href="/register" passHref>
            <Typography component="a" sx={{ color: 'white', textDecoration: 'none', mr: 2 }}>
              Register
            </Typography>
          </Link>
          <Link href="/journal" passHref>
            <Typography component="a" sx={{ color: 'white', textDecoration: 'none', mr: 2 }}>
              New Entry
            </Typography>
          </Link>
          <Link href="/entries" passHref>
            <Typography component="a" sx={{ color: 'white', textDecoration: 'none' }}>
              Entries
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Journal App
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;