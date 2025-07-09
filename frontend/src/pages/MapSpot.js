// MapSpot.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'; // Removed unused Marker
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HomeButton from '../components/HomeButton'; // Path is correct
import PageTemplate from '../components/PageTemplate'; // Path is correct

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapSpot = () => { // Renamed component function
  const [years, setYears] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState(5);

  const crimeColorMap = {
    'THEFT': 'blue', // Standardized to uppercase for matching
    'ASSAULT': 'red', // Standardized to uppercase for matching
    'ROBBERY': 'purple', // Standardized to uppercase for matching
    'BURGLARY': 'orange', // Standardized to uppercase for matching
    'VANDALISM': 'green', // Standardized to uppercase for matching
    'DEFAULT': 'grey' // Standardized to uppercase
  };
  const getCrimeColor = (crimeDescription) => {
    if (!crimeDescription) return crimeColorMap['DEFAULT'];
    const upperCrimeDesc = crimeDescription.toUpperCase(); // Convert once
    for (const typeKey in crimeColorMap) {
      // Ensure typeKey is also uppercase if your map keys are, or handle consistently
      if (upperCrimeDesc.includes(typeKey)) { // Match against uppercase keys
        return crimeColorMap[typeKey];
      }
    }
    return crimeColorMap['DEFAULT'];
  };
  

  useEffect(() => {
    axios.get('http://localhost:8000/api/options/api/options')
      .then(res => {
        setYears(res.data.years || [2020, 2021, 2022, 2023, 2024]); // Use years from API
        setCrimeTypes(res.data.crimeTypes || []);
      })
      .catch(() => {
        setError('Failed to load filter options.');
        setYears([2020, 2021, 2022, 2023, 2024]);
      });
  }, []);

  const handleFetchMapData = useCallback(async () => {
    if (!selectedYear) {
      setError('Please select a year.');
      return;
    }
    setLoading(true);
    setError('');
    setMapData([]);

    try {
      const params = { year: selectedYear };
      if (selectedCrimeType) {
        params.crime_type = selectedCrimeType;
      }
      const response = await axios.get('http://localhost:8000/api/map_data/crime_incidents', { params });
      setMapData(response.data);
      if (response.data.length > 0) {
        setMapCenter([response.data[0].Latitude, response.data[0].Longitude]);
        setMapZoom(10);
      } else {
        setMapCenter([20.5937, 78.9629]);
        setMapZoom(5);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch map data.');
      setMapData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedCrimeType]);
 
  

  return (
    <PageTemplate title="Crime Hotspot Map">
      <HomeButton />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem> // Corrected key and value
              ))}
            </Select>
          </FormControl>
        </Grid>
         
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Crime Type (Optional)</InputLabel>
            <Select value={selectedCrimeType} label="Crime Type (Optional)" onChange={(e) => setSelectedCrimeType(e.target.value)}>
              <MenuItem value=""><em>All Crime Types</em></MenuItem>
              {crimeTypes.map((type) => ( // type is a string here
                <MenuItem key={type} value={type}>{type}</MenuItem> 
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" onClick={handleFetchMapData} disabled={loading || !selectedYear} fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Load Map'}
          </Button>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Added sx prop */}
      
      <Box sx={{ position: 'relative' }}>
        <Paper elevation={3} sx={{ height: '65vh', width: '100%' }}>
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} key={mapCenter.join(',') + '-' + mapZoom}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            /> {/* Self-closed TileLayer */}
            {mapData.map((point, index) => (
              <CircleMarker
                key={index}
                center={[point.Latitude, point.Longitude]}
                radius={7}
                pathOptions={{
                  color: getCrimeColor(point['Crime Description']),
                  fillColor: getCrimeColor(point['Crime Description']),
                  fillOpacity: 0.7
                }}
              >
                <Popup>
                  <b>{point['Crime Description']}</b><br />
                  City: {point.City || 'N/A'}<br />
                  Date: {new Date(point['Date of Occurrence']).toLocaleDateString()}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </Paper>
        <Box
  sx={{
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
    minWidth: 180,
    maxHeight: '70vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}
> 
  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
    Crime Type Legend
  </Typography>
  {Object.entries(crimeColorMap)
    .filter(([type]) => type !== 'DEFAULT')
    .map(([type, color]) => {
      console.log("Legend item:", type, color); // Added console.log
      return (
        <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: color,
            border: '1px solid #888',
            mr: 1
          }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
        </Box>
      );
  })}
</Box>
      </Box>
    </PageTemplate>
  );
};

export default MapSpot; // Renamed export
