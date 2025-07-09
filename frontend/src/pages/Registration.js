// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Box,
//   Alert,
//   Link,
// } from '@mui/material';
// import axios from 'axios';

// function Registration() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     phone: '',
//     name: '',
//     city: '',
//     notify_email: true,
//     notify_sms: false,
//     notify_high_risk: true,
//     notify_medium_risk: true,
//     notify_low_risk: false,
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/auth/register', {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       });

//       setSuccess('Registration successful! Redirecting to login...');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       setError(
//         error.response?.data?.detail || 'Error during registration. Please try again.'
//       );
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography component="h1" variant="h4" align="center" gutterBottom>
//           Register
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {success}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 label="Full Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 label="Email Address"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 label="Phone Number"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 label="Confirm Password"
//                 name="confirmPassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 fullWidth
//               >
//                 Register
//               </Button>
//             </Grid>

//             <Grid item xs={12}>
//               <Box textAlign="center">
//                 <Typography variant="body2">
//                   Already have an account?{' '}
//                   <Link href="/login" variant="body2">
//                     Sign in
//                   </Link>
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

// export default Registration; 