'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Paper, 
  TextField,
  IconButton,
  Drawer,
  useMediaQuery,
  Theme
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { authenticatedFetch } from '@/utils/api'

interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isNewEntry, setIsNewEntry] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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
      setEntries(data)
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
    if (isMobile) setIsSidebarOpen(false)
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
        setSelectedEntry(newEntry)
      } else if (selectedEntry) {
        const response = await authenticatedFetch(`/api/entries/${selectedEntry.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content })
        })
        if (!response.ok) throw new Error('Failed to update entry')
        const updatedEntry = await response.json()
        setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e))
        setSelectedEntry(updatedEntry)
      }
      setIsNewEntry(false)
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
    <Box sx={{ width: 300, flexShrink: 0 }}>
      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleNewEntry}
        sx={{ mb: 2 }}
      >
        Start Writing
      </Button>
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
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </Typography>
                  {' — ' + entry.content.substring(0, 30) + '...'}
                </>
              }
            />
            <IconButton onClick={() => handleDelete(entry.id)} edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const renderMainContent = () => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
          Start writing or{' '}
          <Button onClick={() => setIsSidebarOpen(true)}>peruse a previous journal entry</Button>
        </Typography>
      )}
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {renderSidebar()}
        </Drawer>
      ) : (
        <Paper elevation={3} sx={{ mr: 2 }}>
          {renderSidebar()}
        </Paper>
      )}
      <Box sx={{ flexGrow: 1 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsSidebarOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {renderMainContent()}
      </Box>
    </Box>
  )
}
