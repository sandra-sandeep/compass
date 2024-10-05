'use client'

import React from 'react'
import { Typography, Box } from '@mui/material'
import JournalEntryForm from '@/components/JournalEntryForm'

export default function JournalPage() {
  const handleSubmit = (title: string, content: string) => {
    console.log('New journal entry:', { title, content })
    // Here you would typically send this data to your backend
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New Journal Entry
      </Typography>
      <JournalEntryForm onSubmit={handleSubmit} />
    </Box>
  )
}