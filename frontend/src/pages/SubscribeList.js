// srcc/frontend/src/pages/SubscribeList.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import HomeButton from '../components/HomeButton';

const SubscribeList = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    notify_email: true,
    notify_sms: false,
    notify_high_risk: true,
    notify_medium_risk: true,
    notify_low_risk: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/options/api/options') // Ensure this is the corrected endpoint
      .then(res => setCities(res.data.cities || []))
      .catch(() => setCities([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8000/api/alerts/subscribe', formData);
      setSuccess('Subscription created successfully!');
      setFormData({
        phone: '',
        name: '',
        city: '',
        notify_email: true,
        notify_sms: false,
        notify_high_risk: true,
        notify_medium_risk: true,
        notify_low_risk: false,
      });
    } catch (error) {
      setError(
        error.response?.data?.detail || 'Error creating subscription. Please try again.'
      );
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#f5f8fa' }}>
      <HomeButton />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Subscribe to Crime Alerts
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
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
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notify_email}
                      onChange={handleChange}
                      name="notify_email"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notify_sms}
                      onChange={handleChange}
                      name="notify_sms"
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notify_high_risk}
                      onChange={handleChange}
                      name="notify_high_risk"
                    />
                  }
                  label="High Risk Alerts"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notify_medium_risk}
                      onChange={handleChange}
                      name="notify_medium_risk"
                    />
                  }
                  label="Medium Risk Alerts"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notify_low_risk}
                      onChange={handleChange}
                      name="notify_low_risk"
                    />
                  }
                  label="Low Risk Alerts"
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
                  Subscribe
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default SubscribeList;