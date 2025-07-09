import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MapIcon from '@mui/icons-material/Map';
import ReportIcon from '@mui/icons-material/Report';
import TravelExploreIcon from '@mui/icons-material/TravelExplore'; // Icon for the new map feature
import '../App.css';

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: 'Safety Predictions',
      description: 'Get personalized safety recommendations and Predictions powered by smart analysis',
      icon: AssessmentIcon,
      path: '/predict'
    },
    {
      title: 'Community Alerts',
      description: 'Subscribe to Stay informed about neighborhood safety with timely updates',
      icon: NotificationsActiveIcon,
      path: '/subscribe'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Explore interactive safety patterns in your neighborhood',
      icon: MapIcon,
      path: '/analytics'
    },
    {
      title: 'Crime Reporting',
      description: 'Contribute to neighborhood safety by reporting concerns',
      icon: ReportIcon,
      path: '/report'
    },
    {
      title: 'Crime Hotspot Map',
      description: 'Visualize crime incidents on an interactive map by year and type.',
      icon: TravelExploreIcon,
      path: '/map-spot'
    }
  ];

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'primary.main',
            mb: 2,
          }}
        >
          Crime Hotspot Prediction
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: 'text.secondary', mb: 6 }}
        >
          Building safer communities through data-driven neighborhood insights
        </Typography>

        {/* First row: 3 items */}
        <Grid container spacing={4} justifyContent="center">
          {features.slice(0, 3).map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 4px 24px rgba(60,72,100,0.08)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 32px rgba(60,72,100,0.16)'
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mx: 'auto',
                  }}
                >
                  <feature.icon sx={{ fontSize: 36, color: '#fff' }} />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" align="center" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <Button
                  size="large"
                  onClick={() => navigate(feature.path)}
                  variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: 8,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(60,72,100,0.08)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
                    },
                  }}
                  fullWidth
                >
                  Learn More
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Second row: 2 items */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
          {features.slice(3).map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 4px 24px rgba(60,72,100,0.08)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 32px rgba(60,72,100,0.16)'
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mx: 'auto',
                  }}
                >
                  <feature.icon sx={{ fontSize: 36, color: '#fff' }} />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" align="center" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <Button
                  size="large"
                  onClick={() => navigate(feature.path)}
                  variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: 8,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(60,72,100,0.08)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
                    },
                  }}
                  fullWidth
                >
                  Learn More
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
