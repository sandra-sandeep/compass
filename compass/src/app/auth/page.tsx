'use client'

import React, { useState } from 'react'
import { Typography, Button, Box, TextField, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tab === 0) {
      console.log('Login:', email, password)
      // Implement login logic here
    } else {
      console.log('Register:', email, password, confirmPassword)
      // Implement register logic here
    }
    // For now, just redirect to the journal page
    router.push('/journal')
  }

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {tab === 0 ? 'Sign In' : 'Sign Up'}
        </Button>
      </Box>
    </Box>
  )
}