'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Box, 
  Typography, 
  List, 
  Card,
  CardContent,
  Button, 
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material'
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Check as CheckIcon } from '@mui/icons-material'
import { authenticatedFetch } from '@/utils/api'

interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isNewEntry, setIsNewEntry] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleSave = useCallback(async () => {
    if (!title && !content) return

    setIsSaving(true)
    const entryTitle = title || 'Draft'
    try {
      if (isNewEntry) {
        const response = await authenticatedFetch('/entries/', {
          method: 'POST',
          body: JSON.stringify({ title: entryTitle, content })
        })
        if (!response.ok) throw new Error('Failed to create entry')
        const newEntry = await response.json()
        setEntries(prevEntries => [newEntry, ...prevEntries])
        setSelectedEntry(newEntry)
        setIsNewEntry(false)
      } else if (selectedEntry) {
        const response = await authenticatedFetch(`/entries/${selectedEntry.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title: entryTitle, content })
        })
        if (!response.ok) throw new Error('Failed to update entry')
        const updatedEntry = await response.json()
        setEntries(prevEntries => prevEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
        setSelectedEntry(updatedEntry)
      }
      setIsDirty(false)
      setError(null)
    } catch (error) {
      console.error('Error saving entry:', error)
      setError('Failed to save entry. Please try again later.')
    } finally {
      setIsSaving(false)
    }
  }, [title, content, isNewEntry, selectedEntry])

  useEffect(() => {
    if (isDirty) {
      const debouncedSave = setTimeout(() => {
        handleSave()
      }, 5000)

      return () => clearTimeout(debouncedSave)
    }
  }, [title, content, isDirty, handleSave])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await authenticatedFetch('/entries/', { method: 'GET' })
      if (!response.ok) throw new Error('Failed to fetch entries')
      const data = await response.json()
      const sortedEntries = data.sort((a: JournalEntry, b: JournalEntry) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setEntries(sortedEntries)
      setError(null)
    } catch (error) {
      console.error('Error fetching entries:', error)
      setError('Failed to fetch entries. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewEntry = () => {
    if (isDirty) {
      handleSave()
    }
    setSelectedEntry(null)
    setIsNewEntry(true)
    setTitle('')
    setContent('')
    setIsDirty(false)
  }

  const handleSelectEntry = (entry: JournalEntry) => {
    if (isDirty) {
      handleSave()
    }
    setSelectedEntry(entry)
    setIsNewEntry(false)
    setTitle(entry.title)
    setContent(entry.content)
    setIsDirty(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/entries/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete entry')
      setEntries(entries.filter(entry => entry.id !== id))
      if (selectedEntry?.id === id) {
        setSelectedEntry(null)
        setIsNewEntry(false)
        setTitle('')
        setContent('')
        setIsDirty(false)
      }
      setError(null)
    } catch (error) {
      console.error('Error deleting entry:', error)
      setError('Failed to delete entry. Please try again later.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  const renderSidebar = useCallback(() => (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'auto', 
      bgcolor: 'primary.main',
      color: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ 
        p: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'primary.main',
      }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleNewEntry}
          aria-label="Start a new journal entry"
          sx={{ 
            bgcolor: 'primary.main',
            color: 'background.paper',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Start Writing
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ px: 2, py: 2, flexGrow: 1, overflow: 'auto' }}>
          {entries.map((entry) => (
            <Card 
              key={entry.id}
              onClick={() => handleSelectEntry(entry)}
              sx={{ 
                cursor: 'pointer', 
                mb: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {entry.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {entry.content.substring(0, 50)}...
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                  {formatDate(entry.updatedAt)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center', px: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  ), [entries, isLoading, error, handleNewEntry, handleSelectEntry])

  const renderMainContent = useCallback(() => (
    <Box sx={{ flexGrow: 1, p: 3, height: '100%', overflow: 'auto', bgcolor: 'background.default' }}>
      {isMobile && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            setSelectedEntry(null)
            setIsNewEntry(false)
          }}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Entries
        </Button>
      )}
      {selectedEntry || isNewEntry ? (
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setIsDirty(true)
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={10}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              setIsDirty(true)
            }}
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={isSaving}
              sx={{ 
                minWidth: '100px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  transition: 'opacity 0.3s, transform 0.3s',
                  opacity: isDirty || isSaving ? 1 : 0,
                  transform: isDirty || isSaving ? 'translateY(0)' : 'translateY(100%)',
                }}
              >
                {isDirty ? 'Save' : (isSaving ? 'Saving...' : '')}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  transition: 'opacity 0.3s, transform 0.3s',
                  opacity: !isDirty && !isSaving ? 1 : 0,
                  transform: !isDirty && !isSaving ? 'translateY(0)' : 'translateY(-100%)',
                }}
              >
                <CheckIcon sx={{ mr: 1 }} />
                Saved
              </Box>
            </Button>
            {selectedEntry && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => handleDelete(selectedEntry.id)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" align="center" color="text.primary">
          Select an entry or start writing a new one
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  ), [selectedEntry, isNewEntry, title, content, isDirty, isSaving, error, isMobile, handleSave, handleDelete])

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      {isMobile ? (
        (selectedEntry || isNewEntry) ? renderMainContent() : renderSidebar()
      ) : (
        <>
          <Box sx={{ width: 300, flexShrink: 0 }}>
            {renderSidebar()}
          </Box>
          {renderMainContent()}
        </>
      )}
    </Box>
  )
}