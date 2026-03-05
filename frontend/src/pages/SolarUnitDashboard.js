import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Typography, Switch } from "@mui/material";
import api from "../services/api";

export default function SolarUnitDashboard() {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);

  const fetchUnit = async () => {
    try {
      const { data } = await api.get(`/solar-units/${unitId}`);
      setUnit(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, []);

  const toggleLoad = async () => {
    try {
      await api.patch(`/solar-units/${unitId}/status`, {
        status: !unit.status
      });
      fetchUnit();
    } catch (err) {
      console.error(err);
    }
  };

  if (!unit) return <Typography>Loading...</Typography>;

  const energy = (unit.power * 24 / 1000).toFixed(2);
  const cost = (energy * 0.19).toFixed(2);

  const Card = ({ title, value }) => (
    <Paper sx={{ p:3, textAlign:"center" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );

  return (
    <Grid container spacing={3} sx={{ p:4 }}>

      <Grid item xs={12} md={4}>
        <Card title="Voltage" value={`${unit.voltage} V`} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card title="Current" value={`${unit.current} A`} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card title="Power" value={`${unit.power} W`} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card title="Power Factor" value={unit.powerFactor || "0"} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card title="Energy (kWh)" value={energy} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Card title="Total Cost ($)" value={cost} />
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p:3, textAlign:"center" }}>
          <Typography variant="h6">Load Control</Typography>
          <Switch
            checked={unit.status}
            onChange={toggleLoad}
            color="success"
          />
        </Paper>
      </Grid>

    </Grid>
  );
}