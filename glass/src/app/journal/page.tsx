'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  TextField,
  IconButton,
  useMediaQuery,
  Theme
} from '@mui/material'
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
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
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await authenticatedFetch('/api/entries/', { method: 'GET' })
      if (!response.ok) throw new Error('Failed to fetch entries')
      const data = await response.json()
      // Sort entries by updatedAt time, latest first
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

  const renderSidebar = () => (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'auto', 
      borderRight: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ p: 2, pt: 3 }}> {/* Added padding top for space above the button */}
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleNewEntry}
          sx={{ mb: 2 }}
        >
          Start Writing
        </Button>
      </Box>
      <List>
        {entries.map((entry) => (
          <ListItem 
            key={entry.id} 
            onClick={() => handleSelectEntry(entry)}
            sx={{ 
              cursor: 'pointer', 
              bgcolor: selectedEntry?.id === entry.id ? 'action.selected' : 'inherit'
            }}
          >
            <ListItemText
              primary={entry.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {new Date(entry.updatedAt).toLocaleString()} {/* Changed from createdAt to updatedAt */}
                  </Typography>
                  {' — ' + entry.content.substring(0, 30) + '...'}
                </>
              }
            />
            <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const renderMainContent = () => (
    <Box sx={{ flexGrow: 1, p: 3, height: '100%', overflow: 'auto' }}>
      {isMobile && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            setSelectedEntry(null)
            setIsNewEntry(false)
          }}
          sx={{ mb: 2 }}
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
          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" align="center">
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