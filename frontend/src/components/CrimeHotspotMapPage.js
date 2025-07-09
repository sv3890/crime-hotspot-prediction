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
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HomeButton from '../components/HomeButton';
import PageTemplate from '../components/PageTemplate';

// Fix for default marker icons (same as in your existing Map.js)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CrimeHotspotMapPage = () => {
  const [years, setYears] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState(5);

  // Predefined colors for crime types for simplicity
  const crimeColorMap = {
    'Theft': 'blue',
    'Assault': 'red',
    'Robbery': 'purple',
    'Burglary': 'orange',
    'Vandalism': 'green',
    // Add more crime types and colors as needed
    'default': 'grey' // Fallback color
  };

  const getCrimeColor = (crimeDescription) => {
    for (const type in crimeColorMap) {
      if (crimeDescription && crimeDescription.toLowerCase().includes(type.toLowerCase())) {
        return crimeColorMap[type];
      }
    }
    return crimeColorMap['default'];
  };

  useEffect(() => {
    // Fetch options for dropdowns (years and crime types)
    axios.get('http://localhost:8000/api/options/api/options')
      .then(res => {
        // Assuming your options endpoint returns years if available, or derive them
        // For now, let's use a fixed list of years if not provided by API
        const uniqueYears = [...new Set(res.data.crimeData?.map(item => item.Year) || [])].sort((a, b) => b - a);
        setYears(uniqueYears.length > 0 ? uniqueYears : [2020, 2021, 2022, 2023, 2024]); // Fallback years
        setCrimeTypes(res.data.crimeTypes || []);
      })
      .catch(() => {
        setError('Failed to load filter options.');
        setYears([2020, 2021, 2022, 2023, 2024]); // Fallback
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
        // Recenter map based on first data point, or keep default
        setMapCenter([response.data[0].Latitude, response.data[0].Longitude]);
        setMapZoom(10); // Zoom in a bit
      } else {
        setMapCenter([20.5937, 78.9629]); // Reset to default if no data
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
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Crime Type (Optional)</InputLabel>
            <Select value={selectedCrimeType} label="Crime Type (Optional)" onChange={(e) => setSelectedCrimeType(e.target.value)}>
              <MenuItem value=""><em>All Crime Types</em></MenuItem>
              {crimeTypes.map((type) => (
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper elevation={3} sx={{ height: '60vh', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} key={mapCenter.join(',')}> {/* Add key to force re-render on center change */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mapData.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.Latitude, point.Longitude]}
              radius={7} // Adjust radius as needed
              pathOptions={{ color: getCrimeColor(point['Crime Description']), fillColor: getCrimeColor(point['Crime Description']), fillOpacity: 0.7 }}
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
    </PageTemplate>
  );
};

export default CrimeHotspotMapPage;
