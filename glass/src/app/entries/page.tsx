'use client'

import React, { useState, useEffect } from 'react'
import { Typography, List, ListItem, ListItemText, IconButton, Box, Dialog, DialogTitle, DialogContent, CircularProgress, Snackbar } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import JournalEntryForm from '@/components/JournalEntryForm'
import { authenticatedFetch } from '@/utils/api'

interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await authenticatedFetch('/api/entries/', { method: 'GET' })
      if (!response.ok) {
        throw new Error('Failed to fetch entries')
      }
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      setError('Failed to load entries. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/entries/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }
      setEntries(entries.filter(entry => entry.id !== id))
    } catch (error) {
      setError('Failed to delete entry. Please try again.')
    }
  }

  const handleUpdate = async (title: string, content: string) => {
    if (editingEntry) {
      try {
        const response = await authenticatedFetch(`/api/entries/${editingEntry.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content })
        })
        if (!response.ok) {
          throw new Error('Failed to update entry')
        }
        const updatedEntry = await response.json()
        setEntries(entries.map(entry =>
          entry.id === editingEntry.id ? updatedEntry : entry
        ))
        setEditingEntry(null)
      } catch (error) {
        setError('Failed to update entry. Please try again.')
      }
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Journal Entries
      </Typography>
      {entries.length === 0 ? (
        <Typography>No entries yet. Start journaling!</Typography>
      ) : (
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
      )}
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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  )
}