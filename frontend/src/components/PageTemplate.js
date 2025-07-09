import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

function PageTemplate({ title, children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#f5f8fa' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {title}
          </Typography>
          {children}
        </Paper>
      </Container>
    </div>
  );
}

export default PageTemplate;
