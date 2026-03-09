import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Switch, Container, Box, Button } from "@mui/material";
import { Gauge } from "@mui/x-charts";
import api from "../services/api";

export default function SolarUnitDashboard() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);

  const toggleLoad = async () => {
    try {
      await api.patch(`/solar-units/${unitId}/status`, {
        status: !unit.status
      });
      setUnit(prev => ({ ...prev, status: !prev.status }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const { data } = await api.get(`/solar-units/${unitId}`);
        setUnit(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUnits(); // initial fetch
    const interval = setInterval(loadUnits, 7000); // refresh every 7s
    return () => clearInterval(interval);
  }, [unitId]);

  if (!unit) return <Typography>Loading...</Typography>;

  const energy = (unit.power * 24 / 1000).toFixed(2);
  const cost = (energy * 0.19).toFixed(2);

  // Gauge Card Component
  const GaugeCard = ({ title, value, max, unitLabel }) => (
    <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      <Box display="flex" justifyContent="center">
        <Gauge
          width={200}
          height={200}
          value={Number(value)}
          valueMax={max}
          startAngle={-110}
          endAngle={110}
          text={({ value }) => `${value} ${unitLabel}`}
          sx={{
            [`& .MuiGauge-valueText`]: { fontSize: 24 }
          }}
        />
      </Box>
    </Paper>
  );

  // Normal Card Component
  const Card = ({ title, value }) => (
    <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
      {/* Back Button */}
      <Box mb={3} display="flex" alignItems="center">
        <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
          Unit ID: {unit.unitId}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ p: 4 }}>
        {/* First row: Gauges */}
        <Grid>
          <GaugeCard title="Voltage" value={unit.voltage} max={300} unitLabel="V" />
        </Grid>
        <Grid>
          <GaugeCard title="Current" value={unit.current} max={100} unitLabel="A" />
        </Grid>
        <Grid>
          <GaugeCard title="Power" value={unit.power} max={5000} unitLabel="W" />
        </Grid>

        {/* Second row: Normal Cards + Load Switch */}
        <Grid>
          <Card title="Power Factor" value={unit.powerFactor || 0} />
        </Grid>
        <Grid>
          <Card title="Energy (kWh)" value={energy} />
        </Grid>
        <Grid>
          <Card title="Total Cost ($)" value={cost} />
        </Grid>

        {/* Load Switch: full width */}
        <Grid>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6">Load Control</Typography>
            <Switch checked={unit.status} onChange={toggleLoad} color="success" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}