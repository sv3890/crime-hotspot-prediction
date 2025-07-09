// c:\Users\Admin\Desktop\CRP - Copy\srccW\frontend\src\pages\InteractiveCrimeMapPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
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
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HomeButton from '../components/HomeButton'; // Assuming this component exists
import PageTemplate from '../components/PageTemplate'; // Assuming this component exists

// No need to set default Leaflet marker icons since only CircleMarker is used.

const InteractiveCrimeMapPage = () => {
  const [years, setYears] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState(5);

  // Define a color mapping for crime types
  // You can expand this map with more specific crime types and colors
  const crimeColorMap = {
    'ARSON': '#FF6347', // Tomato
    'ASSAULT': '#FF0000', // Red
    'BURGLARY': '#FFA500', // Orange
    'COUNTERFEITING': '#BDB76B', // DarkKhaki
    'CYBERCRIME': '#4682B4', // SteelBlue
    'DOMESTIC VIOLENCE': '#DA70D6', // Orchid
    'DRUG OFFENSE': '#20B2AA', // LightSeaGreen
    'EXTORTION': '#8B0000', // DarkRed
    'FIREARM OFFENSE': '#A52A2A', // Brown
    'FRAUD': '#5F9EA0', // CadetBlue
    'HOMICIDE': '#000000', // Black
    'IDENTITY THEFT': '#6A5ACD', // SlateBlue
    'ILLEGAL POSSESSION': '#D2691E', // Chocolate
    'KIDNAPPING': '#800000', // Maroon
    'PUBLIC INTOXICATION': '#FFD700', // Gold
    'ROBBERY': '#8A2BE2', // BlueViolet
    'SEXUAL ASSAULT': '#FF1493', // DeepPink
    'SHOPLIFTING': '#00CED1', // DarkTurquoise
    'TRAFFIC VIOLATION': '#32CD32', // LimeGreen
    'VANDALISM': '#008000', // Green
    'VEHICLE - STOLEN': '#4B0082', // Indigo
    'DEFAULT': '#808080' // Grey (Fallback color)
  };

  const getCrimeColor = (crimeDescription) => {
    if (!crimeDescription) return crimeColorMap['DEFAULT'];
    const upperCrimeDesc = crimeDescription.toUpperCase();
    for (const type in crimeColorMap) {
      if (upperCrimeDesc.includes(type)) {
        return crimeColorMap[type];
      }
    }
    return crimeColorMap['DEFAULT'];
  };

  useEffect(() => {
    // Fetch options for dropdowns (years and crime types)
    axios.get('http://localhost:8000/api/options/api/options')
      .then(res => {
        setYears(res.data.years || []); // Use years from API
        setCrimeTypes(res.data.crimeTypes || []);
        if (res.data.years && res.data.years.length > 0) {
          setSelectedYear(res.data.years[0]); // Default to the most recent year
        }
      })
      .catch(() => {
        setError('Failed to load filter options. Please try again.');
        // Provide fallback years if API fails
        setYears([2024, 2023, 2022, 2021, 2020]);
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
        // Optional: Recenter map based on first data point
        // setMapCenter([response.data[0].Latitude, response.data[0].Longitude]);
        // setMapZoom(10);
      } else {
         // If no data, keep current center or reset to default
        // setMapCenter([20.5937, 78.9629]);
        // setMapZoom(5);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch map data. Please check your selections.');
      setMapData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedCrimeType]);

  return (
    <PageTemplate title="Interactive Crime Map">
      <HomeButton />
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="crime-type-select-label">Crime Type (Optional)</InputLabel>
            <Select
              labelId="crime-type-select-label"
              value={selectedCrimeType}
              label="Crime Type (Optional)"
              onChange={(e) => setSelectedCrimeType(e.target.value)}
            >
              <MenuItem value=""><em>All Crime Types</em></MenuItem>
              {crimeTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={handleFetchMapData}
            disabled={loading || !selectedYear}
            fullWidth
            sx={{ height: '56px' }} // Match height of Select components
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Load Map'}
          </Button>
        </Grid>
      </Grid>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper elevation={3} sx={{ height: '65vh', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} key={`${mapCenter.join(',')}-${mapZoom}`}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mapData.map((point, idx) => {
            const latitude = Number(point.Latitude);
            const longitude = Number(point.Longitude);
            const crimeDesc = point['Crime Description'] || 'Unknown Crime';
            const city = point.City || 'N/A';
            const date = point['Date of Occurrence'] ? new Date(point['Date of Occurrence']).toLocaleDateString() : 'Unknown Date';
            const color = getCrimeColor(crimeDesc);

            return (
              <CircleMarker
                key={idx}
                center={[latitude, longitude]}
                radius={6}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7
                }}
              >
                <Popup>
                  <b>{crimeDesc}</b><br />
                  City: {city}<br />
                  Date: {date}
                </Popup>
              </CircleMarker>
            );
          })}
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
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Crime Type Legend
        </Typography>
        {Object.entries(crimeColorMap)
    .filter(([type]) => type !== 'DEFAULT')
    .map(([type, color]) => { // Here 'color' is the hex string like '#FF6347'
      // console.log("Legend item:", type, color); 
      return (
        <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: color, // Correctly uses the hex string
            border: '1px solid #888',
            mr: 1
          }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {type.replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
        </Box>
      );
  })}
      </Box>
    </PageTemplate>
  );
};

export default InteractiveCrimeMapPage;
