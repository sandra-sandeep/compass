import React from 'react';
import { List, ListItem, ListItemText, Typography, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <List>
      {entries.map((entry) => (
        <ListItem
          key={entry.id}
          secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(entry)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(entry.id)}>
                <Delete />
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
  );
};

export default JournalEntryList;