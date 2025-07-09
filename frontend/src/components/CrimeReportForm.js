import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, TextField, Button, MenuItem, FormControl, InputLabel, Select, Alert, Container } from '@mui/material';
// import HomeButton from './HomeButton';

const genders = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' }
];

const CrimeReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    crime_type: '',
    date: '',
    time: '',
    location: '',
    description: '',
    victim_age: '',
    victim_gender: '',
    weapon_used: '',
    crime_domain: ''
  });
  const [cities, setCities] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/options/api/options') // Corrected endpoint
      .then(res => {
        setCities(res.data.cities || []);
        setCrimeTypes(res.data.crimeTypes || []);
      })
      .catch(() => {
        setCities([]);
        setCrimeTypes([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8000/api/reporting/submit', formData);
      if (response.data.success) {
        setSuccess('Crime report submitted successfully!');
        setFormData({
          city: '',
          crime_type: '',
          date: '',
          time: '',
          location: '',
          description: '',
          victim_age: '',
          victim_gender: '',
          weapon_used: '',
          crime_domain: ''
        });
      } else {
        setError('Error submitting report: ' + (response.data?.detail || 'Unknown error'));
      }
    } catch (error) {
      setError('Error submitting report: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', background: '#f5f8fa' }}>
      {/* <HomeButton /> */}
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    label="City"
                  >
                    {cities.map((cityObj) => (
                      <MenuItem key={cityObj.value} value={cityObj.value}>{cityObj.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Crime Type</InputLabel>
                  <Select
                    name="crime_type"
                    value={formData.crime_type}
                    onChange={handleChange}
                    label="Crime Type"
                  >
                    {crimeTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Date of Occurrence"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Time of Occurrence"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Victim Age"
                  name="victim_age"
                  type="number"
                  value={formData.victim_age}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Victim Gender</InputLabel>
                  <Select
                    name="victim_gender"
                    value={formData.victim_gender}
                    onChange={handleChange}
                    label="Victim Gender"
                  >
                    {genders.map(g => (
                      <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weapon Used"
                  name="weapon_used"
                  value={formData.weapon_used}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Crime Domain"
                  name="crime_domain"
                  value={formData.crime_domain}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit Report
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CrimeReportForm; 