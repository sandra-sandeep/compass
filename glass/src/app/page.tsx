import { Typography, Button, Box } from '@mui/material'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjust this value based on your AppBar height
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Compass
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Your Personal Journaling App
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          component={Link}
          href="/auth"
          variant="contained"
          color="primary"
          size="large"
        >
          Get Started
        </Button>
      </Box>
    </Box>
  )
}