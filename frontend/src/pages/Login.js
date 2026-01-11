import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

import background from '../assets/solar-bg.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cebId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Automatically convert CEB ID to UPPERCASE
    setForm(prev => ({
      ...prev,
      [name]: name === 'cebId' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.cebId.trim()) {
      setError('CEB ID is required');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/login', {
        cebId: form.cebId.trim(),
        password: form.password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userCebId', data.user.cebId);

      toast.success(`Welcome back, ${data.user.name || 'Officer'}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid CEB ID or password';
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
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xs">
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
            Officer / Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239,68,68,0.15)', color: 'white' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="CEB ID"
              name="cebId"
              value={form.cebId}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              autoFocus
              placeholder="e.g. CEB12345"
              inputProps={{ style: { textTransform: 'uppercase' } }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{
                style: { color: 'white' },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                }
              }}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Button
              fullWidth
              color="inherit"
              sx={{ mt: 2, color: 'rgba(255,255,255,0.85)' }}
              onClick={() => navigate('/register')}
            >
              Don't have CEB ID access? Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}