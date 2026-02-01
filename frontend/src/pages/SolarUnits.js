import { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SolarUnits() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userCebId = localStorage.getItem('userCebId');
  const isMobile = useMediaQuery('(max-width:600px)');

  const loadUnits = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/solar-units');

      let filtered = data || [];
      if (userRole === 'user' && userCebId) {
        filtered = filtered.filter((unit) => unit.cebId === userCebId);
      }

      setUnits(filtered);
      setError(null);
    } catch (err) {
      console.error('Failed to load units:', err);
      setError('Failed to load solar units');
      toast.error('Failed to load solar units');
    } finally {
      setLoading(false);
    }
  }, [userRole, userCebId]);

  useEffect(() => {
    loadUnits();
    const interval = setInterval(loadUnits, 7000);
    return () => clearInterval(interval);
  }, [loadUnits]);

  const toggleStatus = async (unitId, currentStatus) => {
    if (!['officer', 'admin'].includes(userRole)) {
      toast.error('You do not have permission to change status');
      return;
    }

    try {
      const newStatus = !currentStatus;
      await api.patch(`/solar-units/${unitId}/status`, { status: newStatus });

      setUnits((prev) =>
        prev.map((u) => (u.unitId === unitId ? { ...u, status: newStatus } : u))
      );

      toast.success(`Unit ${unitId} turned ${newStatus ? 'ON' : 'OFF'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this solar unit?')) return;

    try {
      await api.delete(`/solar-units/${unitId}`);
      setUnits((prev) => prev.filter((u) => u.unitId !== unitId));
      toast.success('Solar unit deleted successfully');
    } catch (err) {
      toast.error('Failed to delete unit');
    }
  };

  const handleEdit = (unit) => {
    navigate(`/edit-solar/${unit.unitId}`);
  };

  const handleSelectAll = (checked) => {
    if (userRole === 'user') return;
    setSelected(checked ? units.map((u) => u.unitId) : []);
  };

  const handleSelect = (unitId) => {
    if (userRole === 'user') return;
    setSelected((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const toggleSelectedUnits = async () => {
    if (!['officer', 'admin'].includes(userRole)) {
      toast.error('You do not have permission to change multiple units');
      return;
    }

    try {
      const newStatus = !units.some((u) => selected.includes(u.unitId) && u.status);

      await Promise.all(
        selected.map((unitId) =>
          api.patch(`/solar-units/${unitId}/status`, { status: newStatus })
        )
      );

      setUnits((prev) =>
        prev.map((u) =>
          selected.includes(u.unitId) ? { ...u, status: newStatus } : u
        )
      );

      toast.success(`Selected units turned ${newStatus ? 'ON' : 'OFF'}`);
      setSelected([]);
    } catch (err) {
      toast.error('Failed to update selected units');
    }
  };

  const filteredUnits = units.filter(
    (u) =>
      u.unitId?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 6, sm: 8 } }}>
        <CircularProgress size={isMobile ? 50 : 60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        gutterBottom
        fontWeight={600}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Solar Units Management
      </Typography>

      <TextField
        fullWidth
        label="Search by Unit ID or Location"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: { xs: 2, sm: 3 }, maxWidth: 500 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['officer', 'admin'].includes(userRole) && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < units.length}
                    checked={units.length > 0 && selected.length === units.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: 'white' }}
                  />
                </TableCell>
              )}
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                Unit ID
              </TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                Location
              </TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="right">
                Voltage (V)
              </TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="right">
                Current (A)
              </TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="right">
                Power (W)
              </TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="center">
                Status
              </TableCell>
              {['officer', 'admin'].includes(userRole) && (
                <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="center">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <TableRow key={unit.unitId} hover>
                  {['officer', 'admin'].includes(userRole) && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(unit.unitId)}
                        onChange={() => handleSelect(unit.unitId)}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {unit.unitId}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {unit.location || '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {unit.voltage != null ? unit.voltage.toFixed(1) : '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {unit.current != null ? unit.current.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {unit.power != null ? unit.power.toFixed(0) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={!!unit.status}
                      onChange={() => toggleStatus(unit.unitId, !!unit.status)}
                      color="success"
                      disabled={userRole === 'user'}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </TableCell>

                  {['officer', 'admin'].includes(userRole) && (
                    <TableCell align="center">
                      <Tooltip title="Edit Unit">
                        <IconButton
                          color="primary"
                          size={isMobile ? 'small' : 'medium'}
                          onClick={() => handleEdit(unit)}
                        >
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>

                      {userRole === 'admin' && (
                        <Tooltip title="Delete Unit">
                          <IconButton
                            color="error"
                            size={isMobile ? 'small' : 'medium'}
                            onClick={() => handleDelete(unit.unitId)}
                          >
                            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={userRole === 'user' ? 7 : 8}
                  align="center"
                  sx={{ py: 4, color: 'text.secondary' }}
                >
                  No solar units found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selected.length > 0 && ['officer', 'admin'].includes(userRole) && (
        <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleSelectedUnits}
            size={isMobile ? 'medium' : 'large'}
            sx={{ px: 4 }}
          >
            Toggle Selected Units ({selected.length})
          </Button>
        </Box>
      )}
    </Container>
  );
}