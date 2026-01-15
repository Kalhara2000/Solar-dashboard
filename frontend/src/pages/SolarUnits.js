import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Checkbox,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/api';

export default function SolarUnits() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUnits();
    const interval = setInterval(loadUnits, 7000);
    return () => clearInterval(interval);
  }, []);

  const loadUnits = async () => {
    try {
      const { data } = await api.get('/solar-units');
      setUnits(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load solar units');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (unitId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.patch(`/solar-units/${unitId}/status`, { status: newStatus });

      setUnits((prev) =>
        prev.map((u) => (u.unitId === unitId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error('Toggle failed:', err);
      setError('Failed to update unit status');
    }
  };

  const handleSelectAll = (checked) => {
    setSelected(checked ? units.map((u) => u.unitId) : []);
  };

  const handleSelect = (unitId) => {
    setSelected((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const filteredUnits = units.filter(
    (u) =>
      u.unitId?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Solar Units Management
      </Typography>

      <TextField
        fullWidth
        label="Search by Unit ID or Location"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 500 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < units.length}
                  checked={units.length > 0 && selected.length === units.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ color: 'white' }}
                />
              </TableCell>
              <TableCell sx={{ color: 'white' }}>Unit ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Location</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                Voltage (V)
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                Current (A)
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="right">
                Power (W)
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <TableRow key={unit.unitId} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(unit.unitId)}
                      onChange={() => handleSelect(unit.unitId)}
                    />
                  </TableCell>
                  <TableCell>{unit.unitId}</TableCell>
                  <TableCell>{unit.location || '-'}</TableCell>
                  <TableCell align="right">
                    {unit.voltage != null ? unit.voltage.toFixed(1) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {unit.current != null ? unit.current.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {unit.power != null ? unit.power.toFixed(0) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={!!unit.status}
                      onChange={() => toggleStatus(unit.unitId, !!unit.status)}
                      color="success"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No solar units found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selected.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained">Selected: {selected.length} units</Button>
        </Box>
      )}
    </Container>
  );
}
