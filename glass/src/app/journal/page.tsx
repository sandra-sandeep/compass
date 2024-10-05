'use client'

import React from 'react'
import { Typography, Box } from '@mui/material'
import JournalEntryForm from '@/components/JournalEntryForm'
import { authenticatedFetch } from '@/utils/api'

export default function JournalPage() {
  const handleSubmit = async (title: string, content: string) => {
    try {
      const response = await authenticatedFetch('/api/entries', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        console.log('New entry created:', newEntry)
        // Handle successful creation (e.g., show a success message, clear the form)
      } else {
        // Handle error
        console.error('Failed to create entry')
      }
    } catch (error) {
      console.error('Error:', error)
    }
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
