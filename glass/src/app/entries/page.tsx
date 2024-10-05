'use client'

import React, { useState } from 'react'
import { Typography, List, ListItem, ListItemText, IconButton, Box, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import JournalEntryForm from '@/components/JournalEntryForm'

interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', title: 'My First Entry', content: 'This is the content of my first journal entry.', createdAt: new Date().toISOString() },
    { id: '2', title: 'Reflections', content: 'Today I reflected on my progress...', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ])

  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
  }

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const handleUpdate = (title: string, content: string) => {
    if (editingEntry) {
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id ? { ...entry, title, content } : entry
      )
      setEntries(updatedEntries)
      setEditingEntry(null)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Journal Entries
      </Typography>
      <List>
        {entries.map((entry) => (
          <ListItem
            key={entry.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(entry)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(entry.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={entry.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {new Date(entry.createdAt).toLocaleString()}
                  </Typography>
                  {' — ' + entry.content.substring(0, 50) + '...'}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={!!editingEntry} onClose={() => setEditingEntry(null)}>
        <DialogTitle>Edit Journal Entry</DialogTitle>
        <DialogContent>
          {editingEntry && (
            <JournalEntryForm
              onSubmit={handleUpdate}
              initialTitle={editingEntry.title}
              initialContent={editingEntry.content}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}