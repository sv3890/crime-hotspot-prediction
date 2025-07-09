import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, CircularProgress, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import HomeButton from '../components/HomeButton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [radar, setRadar] = useState([]);
  const [treemap, setTreemap] = useState([]);
  const [trends, setTrends] = useState({ yearly_trends: [], monthly_trends: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, radarRes, treemapRes, trendsRes] = await Promise.all([
          fetch('http://localhost:8000/api/visualization/summary'),
          fetch('http://localhost:8000/api/visualization/radar'),
          fetch('http://localhost:8000/api/visualization/treemap'),
          fetch('http://localhost:8000/api/visualization/trends'),
        ]);

        const [summaryData, radarData, treemapData, trendsData] = await Promise.all([
          summaryRes.json(),
          radarRes.json(),
          treemapRes.json(),
          trendsRes.json()
        ]);

        setSummary(summaryData);
        setRadar(radarData.radar || []);
        setTreemap(treemapData.treemap || []);
        setTrends(trendsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  const cities = summary?.city_stats?.map(c => c.city) || [];
  const filteredData = selectedCity
    ? summary.city_stats.filter(c => c.city === selectedCity)
    : summary.city_stats;

  const cityTrends = selectedCity
    ? (summary.monthly_trends || []).filter(t => t.city === selectedCity)
    : [];

  return (
    <Box p={3}>
      <HomeButton />
      <Typography variant="h4" gutterBottom>Crime Data Dashboard</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
          <MenuItem value="">All Cities</MenuItem>
          {cities.map(city => (
            <MenuItem key={city} value={city}>{city}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>

        {/* City-wise Crime Count */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Cities by Crime Count</Typography>
              {summary?.city_stats?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData}>
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_crimes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Crime Type Frequency */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Crime Types</Typography>
              {summary?.crime_type_stats?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.crime_type_stats}>
                    <XAxis dataKey="crimeType" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Crimes in Top Cities (Radar)</Typography>
              {radar.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="City" />
                    <PolarRadiusAxis />
                    {Object.keys(radar[0]).filter(k => k !== 'City').map((key, i) => (
                      <Radar key={key} name={key} dataKey={key}
                        stroke={COLORS[i % COLORS.length]}
                        fill={COLORS[i % COLORS.length]} fillOpacity={0.6} />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Treemap */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Crime Domain Treemap</Typography>
              {treemap.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap
                    data={treemap.map(item => ({
                      name: `${item['Crime Domain']}: ${item['Crime Description']}`,
                      size: item.count
                    }))}
                    dataKey="size"
                    stroke="#fff"
                    fill="#8884d8"
                    content={<CustomizedContent />}
                  />
                </ResponsiveContainer>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Victim Demographics Pie Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Victim Demographics</Typography>
              {summary?.gender_stats?.length > 0 ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={summary.gender_stats}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {summary.gender_stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Year-wise Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Year-wise Crime Trends</Typography>
              {trends?.yearly_trends?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.yearly_trends}>
                    <XAxis dataKey="Year" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              ) : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* City Trends by Month */}
        {selectedCity && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Crime Trends by Month for {selectedCity}</Typography>
                {cityTrends.length > 0 ? (
                  <LineChart width={600} height={300} data={cityTrends}>
                    <XAxis dataKey="MonthName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                ) : <Typography>No data available</Typography>}
              </CardContent>
            </Card>
          </Grid>
        )}

      </Grid>
    </Box>
  );
};

const CustomizedContent = (props) => {
  const { x, y, width, height, name } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#8884d8" stroke="#fff" />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12}>
        {name}
      </text>
    </g>
  );
};

export default Dashboard;