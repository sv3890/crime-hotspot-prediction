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

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
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

//     try {
//       const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
//         email: formData.email,
//         password: formData.password,
//       });

//       // Store the token in localStorage
//       localStorage.setItem('token', response.data.access_token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));

//       setSuccess('Login successful! Redirecting...');
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);
//     } catch (error) {
//       setError(
//         error.response?.data?.detail || 'Invalid email or password. Please try again.'
//       );
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography component="h1" variant="h4" align="center" gutterBottom>
//           Sign In
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
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
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
//                 Sign In
//               </Button>
//             </Grid>

//             <Grid item xs={12}>
//               <Box textAlign="center">
//                 <Typography variant="body2">
//                   Don't have an account?{' '}
//                   <Link href="/register" variant="body2">
//                     Sign up
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

// export default Login; 