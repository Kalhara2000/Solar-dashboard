import { Box, Button, Typography, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import background from '../assets/solar-bg.jpg';  // ← add your image here

export default function Home() {
  const navigate = useNavigate();

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
  {/* Glass card */}
  <Container maxWidth="sm">
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(20px)',
        borderRadius: 5,
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
      }}
    >
          {/* Logo / Icon (optional - solar theme) */}
          <Box sx={{ mb: 3 }}>
            {/* You can add <SolarPowerIcon fontSize="large" sx={{ color: '#f59e0b', fontSize: 64 }} /> */}
          </Box>

          {/* Main Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 1.5,
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.2rem' },
              letterSpacing: '-0.5px',
              textShadow: '2px 2px 12px rgba(0,0,0,0.8)',
              lineHeight: 1.1,
            }}
          >
            CEB Solar Management
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.90)',
              mb: 5,
              fontSize: { xs: '1rem', sm: '1.15rem' },
              fontWeight: 400,
              maxWidth: '480px',
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Secure Remote Monitoring & Control System  
            for Grid Stability in Sri Lanka
          </Typography>

          {/* Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 6,
                py: 1.6,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1e3a8a 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 30px rgba(30, 58, 138, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 1.6,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                border: '2px solid rgba(255, 255, 255, 0.65)',
                color: 'white',
                textTransform: 'none',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: '#42a5f5',
                  background: 'rgba(66, 165, 245, 0.12)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(66, 165, 245, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Register
            </Button>
          </Stack>

          {/* Small footer text */}
          <Typography
            variant="body2"
            sx={{
              mt: 8,
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.85rem',
            }}
          >
            © 2025 CEB Solar Management System • Final Year Project • SEU-IS-19-ICT-054
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}