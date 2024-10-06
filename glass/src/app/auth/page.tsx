'use client'

import React, { useState } from 'react'
import { Button, Box, TextField, Tab, Tabs, Alert, Container } from '@mui/material'
import { useRouter } from 'next/navigation'
import { loginOrRegister } from '@/utils/api'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function AuthPage() {
  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (tab === 1 && password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    const endpoint = tab === 0 ? '/api/auth/login' : '/api/auth/register'
    const body = { email, password }  // confirmPassword is not included

    try {
      const response = await loginOrRegister(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        router.push('/journal')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center' 
    }}>
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        Back to Home
      </Button>
      <Container maxWidth="sm">
        <Box sx={{ 
          width: '100%', 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {tab === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {tab === 0 ? 'Sign In' : 'Sign Up'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}