import React from 'react';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<HomeIcon />}
      onClick={() => navigate('/')}
      sx={{
        position: 'absolute',
        top: 24,
        right: 32,
        zIndex: 10,
        minWidth: 120,
        fontWeight: 600,
        fontSize: 16,
        boxShadow: 2
      }}
    >
      Home
    </Button>
  );
};

export default HomeButton;
