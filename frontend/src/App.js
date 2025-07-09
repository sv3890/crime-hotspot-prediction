import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from './components/Footer';


// Pages
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import CrimeReport from './pages/CrimeReport';
import NotFound from './pages/NotFound';
import SubscribeList from './pages/SubscribeList';
import InteractiveCrimeMapPage from './pages/InteractiveCrimeMapPage';
import MapSpot from './pages/MapSpot'; // Changed from CrimeHotspotMapPage to MapSpot

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <main style={{ flex: 1, padding: '20px 0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Prediction />} />
              <Route path="/subscribe" element={<SubscribeList />} />
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/report" element={<CrimeReport />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/map-spot" element={<MapSpot />} /> 
              <Route path="/interactive-crime-map" element={<InteractiveCrimeMapPage />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;