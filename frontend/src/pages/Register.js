import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

import background from '../assets/solar-bg.jpg';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', cebId: '', role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cebId') {
      setForm(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        cebId: form.cebId.trim(),
        role: form.role
      });

      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'fixed',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.78)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 5,
            p: { xs: 4, sm: 5 },
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color="white"
            gutterBottom
            sx={{ mb: 1, textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}
          >
            CEB Solar Management
          </Typography>

          <Typography variant="subtitle1" color="rgba(255,255,255,0.85)" sx={{ mb: 4 }}>
            Create New Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239,68,68,0.15)', color: 'white' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name" name="name" value={form.name}
              onChange={handleChange} margin="normal" required
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                }
              }}
            />

            <TextField
              fullWidth label="Email" name="email" type="email" value={form.email}
              onChange={handleChange} margin="normal" required
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' }, sx: { /* same as above */ } }}
            />

            <TextField
              fullWidth label="CED ID" name="cebId" value={form.cebId}
              onChange={handleChange} margin="normal" required
              inputProps={{ style: { textTransform: 'uppercase' } }}
              helperText="Will be uppercase"
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' }, sx: { /* same */ } }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                label="Role"
                onChange={handleChange}
                sx={{
                  color: 'white',

                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 

                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.4)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#42a5f5'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2'
                  },
                 
                  '.MuiSvgIcon-root': {
                    color: 'white'
                  },
                
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                }}

                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                      color: 'white',
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(66, 165, 245, 0.15)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(25, 118, 210, 0.25)',
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth label="Password" name="password" type="password" value={form.password}
              onChange={handleChange} margin="normal" required
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' }, sx: { /* same */ } }}
            />

            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type="password"
              value={form.confirmPassword} onChange={handleChange} margin="normal" required
              error={form.password && form.confirmPassword && form.password !== form.confirmPassword}
              helperText={
                form.password && form.confirmPassword && form.password !== form.confirmPassword
                  ? "Passwords don't match"
                  : " "
              }
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' }, sx: { /* same */ } }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.6,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1e3a8a 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(30,58,138,0.45)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(30,58,138,0.55)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>

            <Button
              fullWidth
              color="inherit"
              sx={{ mt: 2, color: 'rgba(255,255,255,0.85)' }}
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}