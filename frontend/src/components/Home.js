import { Box, Button, Typography, Container, Stack, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import background from '../assets/solar-bg.jpg'; // ← your solar background image

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

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
        backgroundAttachment: isMobile ? 'scroll' : 'fixed', // better mobile perf
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="sm" sx={{ px: isMobile ? 2 : 3, py: isMobile ? 2 : 4 }}>
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
          {/* Optional Solar Icon (uncomment if you want) */}
          {/* <SolarPowerIcon sx={{ fontSize: isMobile ? 60 : 80, color: '#f59e0b', mb: 3, filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.5))' }} /> */}

          {/* Main Title */}
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: isMobile ? 1 : 1.5,
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3.2rem' },
              letterSpacing: '-0.5px',
              textShadow: '2px 2px 12px rgba(0,0,0,0.8)',
              lineHeight: 1.1,
            }}
          >
            CEB Solar Management
          </Typography>

          {/* Subtitle */}
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            sx={{
              color: 'rgba(255,255,255,0.90)',
              mb: isMobile ? 4 : 5,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              fontWeight: 400,
              maxWidth: '480px',
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Secure Remote Monitoring & Control System  
            for Grid Stability in Sri Lanka
          </Typography>

          {/* Buttons - Stack vertically on mobile */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={isMobile ? 2 : 3}
            justifyContent="center"
            sx={{ mt: isMobile ? 3 : 4 }}
          >
            <Button
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              onClick={() => navigate('/login')}
              fullWidth={isMobile}
              sx={{
                px: isMobile ? 4 : 6,
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
                  boxShadow: '0 12px 30px rgba(30,58,138,0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size={isMobile ? 'medium' : 'large'}
              onClick={() => navigate('/register')}
              fullWidth={isMobile}
              sx={{
                px: isMobile ? 4 : 6,
                py: isMobile ? 1.4 : 1.6,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                border: '2px solid rgba(255,255,255,0.65)',
                color: 'white',
                textTransform: 'none',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: '#42a5f5',
                  background: 'rgba(66,165,245,0.12)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(66,165,245,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Register
            </Button>
          </Stack>

          {/* Footer */}
          <Typography
            variant="body2"
            sx={{
              mt: isMobile ? 6 : 8,
              color: 'rgba(255,255,255,0.55)',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
            }}
          >
            © 2025 CEB Solar Management System • Final Year Project • SEU-IS-19-ICT-054
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}