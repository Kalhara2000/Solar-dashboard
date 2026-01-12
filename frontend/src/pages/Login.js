import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../services/api';

import background from '../assets/solar-bg.jpg';

export default function Login() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [form, setForm] = useState({ cebId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'cebId' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fakeEmail = `${form.cebId.toLowerCase().trim()}@ceb.local`;

      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, form.password);
      const idToken = await userCredential.user.getIdToken();

      // Send ID token to backend
      const { data } = await api.post('/auth/login', { idToken });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userCebId', data.user.cebId);

      toast.success(`Welcome back, ${data.user.name || 'Officer'}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      let msg = 'Login failed';
      if (err.code === 'auth/wrong-password') msg = 'Invalid password';
      if (err.code === 'auth/user-not-found') msg = 'Invalid CEB ID';
      if (err.response?.data?.error) msg = err.response.data.error;

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
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
      <Container maxWidth="xs" sx={{ px: isMobile ? 2 : 3, py: isMobile ? 2 : 4 }}>
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: isMobile ? 4 : 5,
            p: isMobile ? 3 : 5,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight={800}
            color="white"
            gutterBottom
            sx={{
              mb: isMobile ? 1 : 1.5,
              textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            CEB Solar Management
          </Typography>

          <Typography
            variant={isMobile ? 'body1' : 'subtitle1'}
            color="rgba(255,255,255,0.85)"
            sx={{ mb: isMobile ? 3 : 4 }}
          >
            Officer / Admin Login
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: isMobile ? 2 : 3,
                bgcolor: 'rgba(239,68,68,0.15)',
                color: 'white',
                fontSize: isMobile ? '0.85rem' : '1rem',
              }}
            >
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
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                },
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
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              type="submit"
              disabled={loading}
              sx={{
                mt: isMobile ? 3 : 4,
                py: isMobile ? 1.4 : 1.6,
                fontSize: isMobile ? '1rem' : '1.1rem',
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
              {loading ? <CircularProgress size={isMobile ? 20 : 24} color="inherit" /> : 'Login'}
            </Button>

            <Button
              fullWidth
              color="inherit"
              sx={{
                mt: isMobile ? 1.5 : 2,
                color: 'rgba(255,255,255,0.85)',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}
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