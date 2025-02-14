import { ThemeProvider, createTheme } from '@mui/material/styles'

// import DashboardIcon from '@mui/icons-material/Dashboard'
import { Outlet } from 'react-router'
// import StorageIcon from '@mui/icons-material/Storage'

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme'
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D'
        }
      }
    },
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9'
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536
    }
  }
})

// const NAVIGATION: Navigation = [
//   {
//     kind: 'header',
//     title: 'Main items'
//   },
//   {
//     title: 'Dashboard',
//     icon: <DashboardIcon />
//   },
//   {
//     segment: 'sql',
//     title: 'SQL',
//     icon: <StorageIcon />
//   }
// ]

function App() {
  return (
    <ThemeProvider theme={customTheme} defaultMode="dark">
      <Outlet />
    </ThemeProvider>
  )
}

export default App
