// Dashboard.js

import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import api from '../services/api';

// Reusable Stat Card
const StatCard = ({ icon: Icon, title, value, color, bgColor, delay = 0 }) => (
  <Fade in={true} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
    <Paper
      elevation={6}
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: bgColor || 'white',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        '&:hover': { 
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }
      }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          p: 1.5,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: { xs: 40, sm: 48 }, color }} />
      </Box>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontWeight: 500,
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }} 
        gutterBottom
      >
        {title}
      </Typography>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700,
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}
      >
        {value}
      </Typography>
    </Paper>
  </Fade>
);

// Info Card for additional metrics

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    activeUnits: 0,
    totalPower: 0,
    totalGeneration: '0 kWh',
    dailySavings: '0',
    co2Reduction: '0',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const { data } = await api.get('/solar-units/status');
        setStats({
          totalUnits: data.totalUnits || 0,
          activeUnits: data.activeUnits || 0,
          totalPower: data.totalPower?.toFixed(1) || 0,
          totalGeneration: data.totalGeneration || '0 kWh',
          dailySavings: data.dailySavings || '0',
          co2Reduction: data.co2Reduction || '0',
        });
      } catch (err) {
        console.error('Dashboard stats failed:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        pt: { xs: 8, sm: 9 } // Add padding top to account for fixed navbar
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 3, sm: 1 }
        }}
      >
        {/* Header */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 3 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'white',
                borderRadius: 4,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <SolarPowerIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#f57c00' }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                CEB Solar Management
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2, 
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1.1rem' }
              }}
            >
              Real-time Monitoring & Control System
            </Typography>
          </Box>
        </Fade>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              backgroundColor: 'white',
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Main Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3} mt={5}>
            <StatCard
              icon={SolarPowerIcon}
              title="Total Units"
              value={stats.totalUnits}
              color="#4caf50"
              bgColor="#4caf50"
              delay={0}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} mt={5}>
            <StatCard
              icon={PowerSettingsNewIcon}
              title="Active Units"
              value={stats.activeUnits}
              color="#2e7d32"
              bgColor="#2e7d32"
              delay={100}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} mt={5}>
            <StatCard
              icon={ElectricBoltIcon}
              title="Total Power"
              value={`${stats.totalPower} kW`}
              color="#f57c00"
              bgColor="#f57c00"
              delay={200}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} mt={5}>
            <StatCard
              icon={WbSunnyIcon}
              title="Est. Generation"
              value={stats.totalGeneration}
              color="#1976d2"
              bgColor="#1976d2"
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Additional Info Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} mt={5} mb={5}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: 'white',
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: 'primary.main' }}>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Ratio
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {stats.totalUnits > 0 
                        ? `${Math.round((stats.activeUnits / stats.totalUnits) * 100)}%` 
                        : '0%'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg Power/Unit
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="info.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {stats.activeUnits > 0 
                        ? `${(stats.totalPower / stats.activeUnits).toFixed(1)} kW` 
                        : '0 kW'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}