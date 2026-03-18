// SolarUnitDashboard.js

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Grid, 
  Paper, 
  Typography, 
  Switch, 
  Container, 
  Box, 
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useMediaQuery
} from "@mui/material";
import { Gauge } from "@mui/x-charts";
import api from "../services/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

export default function SolarUnitDashboard() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);

  const toggleLoad = async () => {
    if (!unit) return;
    
    setToggling(true);
    try {
      await api.patch(`/solar-units/${unitId}/status`, {
        status: !unit.status
      });
      setUnit(prev => ({ ...prev, status: !prev.status }));
      
    } catch (err) {
      console.error(err);
      setError("Failed to toggle load status");
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    const loadUnits = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/solar-units/${unitId}`);
        setUnit(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load solar unit data");
      } finally {
        setLoading(false);
      }
    };

    loadUnits(); // initial fetch
    const interval = setInterval(loadUnits, 7000); // refresh every 7s
    return () => clearInterval(interval);
  }, [unitId]);

  // Calculate derived values
  const energy = unit?.power ? (unit.power * 24 / 1000).toFixed(2) : "0.00";
  const cost = unit?.power ? (energy * 0.19).toFixed(2) : "0.00";
  const efficiency = unit?.power && unit?.voltage && unit?.current ? 
    ((unit.power / (unit.voltage * unit.current)) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !unit) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/solar-units')}>
              Go Back
            </Button>
          }
        >
          {error || "Solar unit not found"}
        </Alert>
      </Container>
    );
  }

  // Gauge Card Component
  const GaugeCard = ({ title, value, max, unitLabel, color = "primary.main" }) => (
    <Paper sx={{ 
      p: 3, 
      textAlign: "center", 
      borderRadius: 3,
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6
      }
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Box display="flex" justifyContent="center" flex={1}>
        <Gauge
          width={isMobile ? 150 : 200}
          height={isMobile ? 150 : 200}
          value={Number(value) || 0}
          valueMax={max}
          startAngle={-110}
          endAngle={110}
          text={({ value }) => `${value} ${unitLabel}`}
          sx={{
            [`& .MuiGauge-valueText`]: { 
              fontSize: isMobile ? 18 : 24,
              fontWeight: 600,
              fill: color
            },
            [`& .MuiGauge-referenceArc`]: {
              fill: '#e0e0e0'
            },
            [`& .MuiGauge-valueArc`]: {
              fill: color
            }
          }}
        />
      </Box>
    </Paper>
  );

  // Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, color = "primary", subtitle }) => (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3,
      boxShadow: 3,
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: `${color}.light`, 
          borderRadius: 2, 
          p: 1, 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon sx={{ color: `${color}.main`, fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 700, color: `${color}.main`, mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Back Button and Unit Info */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/solar-units')}
            size="large"
          >
            Back to Units
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlashOnIcon sx={{ fontSize: 30, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={600}>
                {unit.unitId}
              </Typography>
            </Box>
            <Chip 
              label={unit.status ? 'Active' : 'Inactive'} 
              color={unit.status ? 'success' : 'default'}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" />
            <Typography variant="body1" color="text.secondary">
              {unit.location || 'Location not set'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Gauges Section */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Real-time Metrics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4} mt={4}>
          <GaugeCard
            title="Voltage"
            value={unit.voltage?.toFixed(1) || 0}
            max={300}
            unitLabel="V"
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} md={4} mt={4}>
          <GaugeCard
            title="Current"
            value={unit.current?.toFixed(2) || 0}
            max={100}
            unitLabel="A"
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={4} mt={4}>
          <GaugeCard
            title="Power"
            value={unit.power?.toFixed(0) || 0}
            max={5000}
            unitLabel="W"
            color="#2196f3"
          />
        </Grid>
      </Grid>

      {/* Metrics Section */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3, mt: 10 }}>
        Performance Metrics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} mt={4}>
          <MetricCard
            title="Efficiency"
            value={`${efficiency}%`}
            icon={SpeedIcon}
            color="info"
            subtitle="Power conversion efficiency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} mt={4}>
          <MetricCard
            title="Daily Energy"
            value={`${energy} kWh`}
            icon={ElectricBoltIcon}
            color="warning"
            subtitle="Estimated daily production"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} mt={4}>
          <MetricCard
            title="Est. Savings"
            value={`$${cost}`}
            icon={BoltIcon}
            color="success"
            subtitle="Based on $0.19/kWh"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} mt={4}>
          <MetricCard
            title="Capacity"
            value={unit.capacity ? `${unit.capacity} kW` : 'N/A'}
            icon={PowerIcon}
            color="secondary"
            subtitle="Maximum output"
          />
        </Grid>
      </Grid>

      {/* Load Control Section */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3, mt: 10 }}>
        Controls
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3, 
            boxShadow: 3,
            bgcolor: unit.status ? 'success.light' : 'grey.100',
            transition: 'background-color 0.3s'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  bgcolor: 'white', 
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unit.status ? 
                    <PowerIcon sx={{ fontSize: 40, color: 'success.main' }} /> : 
                    <PowerOffIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  }
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                    Load Control
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {unit.status ? 
                      'Unit is currently active and generating power' : 
                      'Unit is currently inactive'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {unit.status ? 'ON' : 'OFF'}
                </Typography>
                <Switch
                  checked={unit.status}
                  onChange={toggleLoad}
                  disabled={toggling}
                  color="success"
                  size="large"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'success.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'success.main',
                    },
                  }}
                />
                {toggling && <CircularProgress size={24} />}
              </Box>
            </Box>

            {unit.description && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {unit.description}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Last Updated Indicator */}
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="caption" color="text.secondary">
          Live updates every 7 seconds
        </Typography>
      </Box>
    </Container>
  );
}