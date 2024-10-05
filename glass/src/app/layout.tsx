import ThemeRegistry from '@/components/ThemeRegistry'
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material'
import Link from 'next/link'

export const metadata = {
  title: 'Compass - Your Personal Journaling App',
  description: 'A simple and intuitive journaling app to capture your thoughts and experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Compass
                </Typography>
                <Button color="inherit" component={Link} href="/auth">
                  Login / Register
                </Button>
                <Button color="inherit" component={Link} href="/journal">
                  New Entry
                </Button>
                <Button color="inherit" component={Link} href="/entries">
                  Entries
                </Button>
              </Toolbar>
            </AppBar>
            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
              {children}
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
              <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} Compass
                </Typography>
              </Container>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}