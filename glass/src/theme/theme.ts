'use client'

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#368069', // New primary teal
      light: '#4A9A82', // Lighter shade of primary
      dark: '#2A6651', // Darker shade of primary
    },
    secondary: {
      main: '#80CBC4', // Keeping this teal shade
    },
    background: {
      default: '#F5DEB3', // Light beige (Wheat)
      paper: '#E6D3A3', // Slightly darker beige for contrast
    },
    text: {
      primary: '#5D4037', // Brown
      secondary: '#795548', // Lighter brown
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          backgroundColor: '#368069', // Primary teal
          color: '#F5DEB3', // Light beige text
          '&:hover': {
            backgroundColor: '#4A9A82', // Lighter teal on hover
          },
        },
        outlined: {
          borderColor: '#368069',
          color: '#368069', // Primary teal text for outlined buttons
          '&:hover': {
            backgroundColor: 'rgba(54, 128, 105, 0.08)', // Very light teal background on hover
            borderColor: '#4A9A82',
          },
        },
        text: {
          color: '#368069', // Primary teal text for text buttons
          '&:hover': {
            backgroundColor: 'rgba(54, 128, 105, 0.08)', // Very light teal background on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#368069', // Primary teal for input outline
            },
            '&:hover fieldset': {
              borderColor: '#4A9A82', // Lighter teal on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2A6651', // Darker teal when focused
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(54, 128, 105, 0.08)', // Very light teal background on hover
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#368069', // Primary teal for tab indicator
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#368069', // Primary teal for selected tab
          },
        },
      },
    },
  },
});

export default theme;