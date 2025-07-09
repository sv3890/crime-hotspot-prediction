import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Grid, MenuItem, TextField, Button, Tabs, Tab, Card, CardContent, Alert, FormControl, InputLabel, Select } from '@mui/material';
import HomeButton from '../components/HomeButton';
import PageTemplate from '../components/PageTemplate';
import axios from 'axios';

const yearsFuture = [2025, 2026, 2027];
const yearsPast = [2020, 2021, 2022, 2023, 2024];
const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const ageGroups = [
  { value: '0-18', label: '0–18 (Child/Teen)' },
  { value: '19-30', label: '19–30 (Young Adult)' },
  { value: '31-45', label: '31–45 (Adult)' },
  { value: '46-60', label: '46–60 (Middle-aged)' },
  { value: '60+', label: '60+ (Senior)' }
];

const timeOfDayOptions = [
  { value: 'Morning', label: 'Morning (6 AM - Noon)' },
  { value: 'Afternoon', label: 'Afternoon (Noon - 6 PM)' },
  { value: 'Evening', label: 'Evening (6 PM - Midnight)' },
  { value: 'Night', label: 'Night (Midnight - 6 AM)' }
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const genders = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' }
];

function PredictionPage() {
  const [tab, setTab] = useState(0);
  const [options, setOptions] = useState({ cities: [], genders: [], ageGroups: [] });
  const [form, setForm] = useState({ city: '', gender: '', ageGroup: '', month: '', year: '', timeOfDay: '', dayOfWeek: '' });
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/options/api/options')
      .then(res => setOptions(res.data))
      .catch(() => setError('Failed to load dropdown options'));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    setError('');
    setResult(null);
    setPrediction(null);
    try {
      const payload = {
        city: form.city,
        age_group: form.ageGroup,
        gender: form.gender,
        time_of_day: form.timeOfDay,
        month: String(form.month),
        day_of_week: form.dayOfWeek
      };
      const res = await axios.post('http://127.0.0.1:8000/api/prediction', payload); // Ensure this points to your backend
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setPrediction(res.data.predicted_crime_type);
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please check your input.');
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setAnalysis(null);
    try {
      const payload = {
        city: form.city,
        gender: form.gender,
        age_group: form.ageGroup,
        month: form.month,
        year: form.year,
        time_of_day: form.timeOfDay
      };
      
      const res = await axios.post('http://127.0.0.1:8000/api/analyze', payload);
      setAnalysis(res.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Analysis failed. Please check your input.');
    }
  };

  return (
    <PageTemplate title="Crime Prediction & Analysis">
      <HomeButton />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
        <Tab label="🔮 Predict (2025–2027)" />
        <Tab label="📈 Analyze (2020–2024)" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>City</InputLabel>
              <Select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} label="City">
                {options.cities.map(c => (
                  <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Crime Type</InputLabel>
              <Select value={form.crimeType} onChange={e => setForm({ ...form, crimeType: e.target.value })} label="Crime Type">
                {options.crimeTypes?.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Age</InputLabel>
              <Select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} label="Age">
                {ageGroups.map(group => <MenuItem key={group.value} value={group.value}>{group.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} label="Gender">
                {genders.map(g => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Time of Day</InputLabel>
              <Select
                value={form.timeOfDay}
                onChange={e => setForm({ ...form, timeOfDay: e.target.value })}
                label="Time of Day"
                name="timeOfDay"
              >
                {timeOfDayOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Month</InputLabel>
              <Select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} label="Month">
                {months.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Year" name="year" value={form.year} onChange={handleChange} fullWidth>
              {(tab === 0 ? yearsFuture : yearsPast).map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
          </Grid>
          {tab === 0 && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Day of Week</InputLabel>
                <Select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })} label="Day of Week">
                  {daysOfWeek.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
        <Box sx={{ mt: 3 }}>
          {tab === 0 ? (
            <Button variant="contained" onClick={handlePredict}>Predict</Button>
          ) : (
            <Button variant="contained" onClick={handleAnalyze}>Analyze</Button>
          )}
        </Box>
        <Box sx={{ mt: 4 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {tab === 0 && result && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Most likely crime type: <b>{prediction}</b>
              </Alert>
              {result.top_crimes && (
                <Card sx={{ p: 2, background: '#e3fcec', borderRadius: 2, mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Top 3 Likely Crime Types:</Typography>
                    <ol>
                      {result.top_crimes.map((crime, index) => (
                        <li key={index}>
                          <b>{crime.crime_type}</b> ({(crime.probability * 100).toFixed(1)}%)
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          {tab === 1 && analysis && (
            <Card sx={{ p: 2, background: '#f3f6fa', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Analysis Summary</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{analysis.summary}</Typography>
                {analysis.details && (
                  <>
                    {analysis.details.trend && (
                      <>
                        <Typography variant="subtitle1">Trends Over Years:</Typography>
                        <ul>
                          {analysis.details.trend.map(t => (
                            <li key={t.year}>Year {t.year}: {t.count} cases</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {analysis.details.heatmap && (
                      <>
                        <Typography variant="subtitle1">Time of Day Heatmap:</Typography>
                        <ul>
                          {analysis.details.heatmap.map(h => (
                            <li key={h.hour}>Hour {h.hour}: {h.count} cases</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {analysis.details.top_crime_types && (
                      <>
                        <Typography variant="subtitle1">Top Crime Types:</Typography>
                        <ul>
                          {analysis.details.top_crime_types.map(c => (
                            <li key={c.type}>{c.type}: {c.count} cases</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {analysis.details.victim_profile && (
                      <>
                        <Typography variant="subtitle1">Victim Profile:</Typography>
                        <Typography variant="body2">
                          Most common gender: {analysis.details.victim_profile.most_common_gender}<br />
                          Most common age group: {analysis.details.victim_profile.most_common_age_group}
                        </Typography>
                      </>
                    )}
                    {analysis.details.recommendations && (
                      <>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Recommendations:</Typography>
                        <ul>
                          {analysis.details.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </PageTemplate>
  );
}

export default PredictionPage;