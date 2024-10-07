'use client'

import React, { useEffect } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (token) {
        router.push('/journal')
      }
    }

    checkAuth()
  }, [router])

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: 'text.primary',
            fontSize: { xs: '2.5rem', sm: '3.75rem' }, // Responsive font size
            textAlign: 'center', // Ensure center alignment on all screen sizes
          }}
        >
          Welcome to Compass
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Responsive font size
          }}
        >
          Your personal journaling companion. Start your journey of self-reflection and growth today.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/auth')}
          >
            Login or Signup
          </Button>
        </Box>
      </Container>
    </Box>
  )
}