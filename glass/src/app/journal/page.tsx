'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  List, 
  Card,
  CardContent,
  Button, 
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await authenticatedFetch('/api/entries/', { method: 'GET' })
      if (!response.ok) throw new Error('Failed to fetch entries')
      const data = await response.json()
      const sortedEntries = data.sort((a: JournalEntry, b: JournalEntry) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setEntries(sortedEntries)
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }

  const handleNewEntry = () => {
    setSelectedEntry(null)
    setIsNewEntry(true)
    setTitle('')
    setContent('')
  }

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setIsNewEntry(false)
    setTitle(entry.title)
    setContent(entry.content)
  }

  const handleSave = async () => {
    try {
      if (isNewEntry) {
        const response = await authenticatedFetch('/api/entries/', {
          method: 'POST',
          body: JSON.stringify({ title, content })
        })
        if (!response.ok) throw new Error('Failed to create entry')
        const newEntry = await response.json()
        setEntries([newEntry, ...entries])
        setSelectedEntry(null)
        setIsNewEntry(false)
        setTitle('')
        setContent('')
      } else if (selectedEntry) {
        const response = await authenticatedFetch(`/api/entries/${selectedEntry.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content })
        })
        if (!response.ok) throw new Error('Failed to update entry')
        const updatedEntry = await response.json()
        setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
        setSelectedEntry(updatedEntry)
      }
    } catch (error) {
      console.error('Error saving entry:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/entries/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete entry')
      setEntries(entries.filter(entry => entry.id !== id))
      if (selectedEntry?.id === id) {
        setSelectedEntry(null)
        setIsNewEntry(false)
        setTitle('')
        setContent('')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
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

  const renderSidebar = () => (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'auto', 
      bgcolor: 'primary.main',
      color: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ p: 2, pt: 3 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleNewEntry}
          sx={{ mb: 2 }}
        >
          Start Writing
        </Button>
      </Box>
      <List sx={{ px: 2 }}>
        {entries.map((entry) => (
          <Card 
            key={entry.id}
            onClick={() => handleSelectEntry(entry)}
            sx={{ 
              cursor: 'pointer', 
              mb: 2,
              borderRadius: 2,
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
    </Box>
  )

  const renderMainContent = () => (
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
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save
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
    </Box>
  )

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