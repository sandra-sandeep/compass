import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

interface JournalEntryFormProps {
  onSubmit: (title: string, content: string) => void
  initialTitle?: string
  initialContent?: string
}

export default function JournalEntryForm({ onSubmit, initialTitle = '', initialContent = '' }: JournalEntryFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(title, content)
    if (!initialTitle && !initialContent) {
      setTitle('')
      setContent('')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Entry Title"
        name="title"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="content"
        label="Entry Content"
        id="content"
        multiline
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Save Entry
      </Button>
    </Box>
  )
}