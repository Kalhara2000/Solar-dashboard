import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, Box, CircularProgress } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import api from '../services/api';

// Reusable Stat Card
const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'transform 0.2s',
      backgroundColor: bgColor || 'white',
      '&:hover': { transform: 'translateY(-8px)' },
    }}
  >
    <Icon sx={{ fontSize: 48, color, mb: 2 }} />
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    activeUnits: 0,
    totalPower: 0,
    totalGeneration: '0 kWh',
  });

  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/solar-units/status'); // /api/solar-units/stats
        setStats({
          totalUnits: data.totalUnits || 0,
          activeUnits: data.activeUnits || 0,
          totalPower: data.totalPower?.toFixed(1) || 0,
          totalGeneration: data.totalGeneration || '0 kWh',
        });
      } catch (err) {
        console.error('Dashboard stats failed:', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight={600} align="center">
        CEB Solar Management Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} sx={{ pt: 4 }}>
          <StatCard
            icon={SolarPowerIcon}
            title="Total Units"
            value={stats.totalUnits}
            color="#fff"
            bgColor="#4caf50"
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3} sx={{ pt: 4 }}>
          <StatCard
            icon={PowerSettingsNewIcon}
            title="Active Units"
            value={stats.activeUnits}
            color="#fff"
            bgColor="#2e7d32"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ pt: 4 }}>
          <StatCard
            icon={ElectricBoltIcon}
            title="Total Power"
            value={`${stats.totalPower} kW`}
            color="#fff"
            bgColor="#f57c00"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ pt: 4 }}>
          <StatCard
            icon={ElectricBoltIcon}
            title="Est. Generation"
            value={stats.totalGeneration}
            color="#fff"
            bgColor="#1565c0"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
