// SolarUnits.js

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Fab,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SolarUnits() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);

  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userCebId = localStorage.getItem('userCebId');
  const isMobile = useMediaQuery('(max-width:600px)');

  const openDashboard = (unitId) => {
    navigate(`/solar-unit/${unitId}`);
  };

  const loadUnits = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/solar-units');

      let filtered = data || [];
      if (userRole === 'user' && userCebId) {
        filtered = filtered.filter((unit) => unit.cebId === userCebId);
      }

      // Sort units by unitId
      const sortedUnits = filtered.sort((a, b) => a.unitId.localeCompare(b.unitId));
      
      setUnits(sortedUnits);
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

      toast.success(
        <div>
          <strong>Unit {unitId}</strong>
          <br />
          <small>Turned {newStatus ? 'ON' : 'OFF'}</small>
        </div>
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (unitId) => {
    setUnitToDelete(unitId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/solar-units/${unitToDelete}`);
      setUnits((prev) => prev.filter((u) => u.unitId !== unitToDelete));
      toast.success('Solar unit deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete unit');
    } finally {
      setDeleteDialogOpen(false);
      setUnitToDelete(null);
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

      toast.success(
        <div>
          <strong>{selected.length} units</strong>
          <br />
          <small>Turned {newStatus ? 'ON' : 'OFF'}</small>
        </div>
      );
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

  // Calculate stats
  const activeUnits = units.filter(u => u.status).length;
  const totalPower = units.reduce((sum, u) => sum + (u.power || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Delete Solar Unit
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete solar unit <strong>{unitToDelete}</strong>? 
            This action cannot be undone and will remove all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SolarPowerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={600}>
            Solar Units
          </Typography>
        </Box>

        {['officer', 'admin'].includes(userRole) && (
          <Button
            variant="contained"
            onClick={() => navigate('/add-solar')}
            size="large"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            Add Solar Unit
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, minWidth: 150, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Units</Typography>
          <Typography variant="h4" fontWeight={600}>{units.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150, bgcolor: 'success.light', color: 'white' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Units</Typography>
          <Typography variant="h4" fontWeight={600}>{activeUnits}</Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150, bgcolor: 'info.light', color: 'white' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Power</Typography>
          <Typography variant="h4" fontWeight={600}>{totalPower.toFixed(0)} W</Typography>
        </Paper>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          label="Search by Unit ID or Location"
          size="medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 500 }}
          variant="outlined"
          InputProps={{
            startAdornment: <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Showing: {filteredUnits.length} / {units.length} units
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Units Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['officer', 'admin'].includes(userRole) && (
                <TableCell padding="checkbox" sx={{ color: 'white' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < units.length}
                    checked={units.length > 0 && selected.length === units.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                  />
                </TableCell>
              )}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Voltage (V)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Current (A)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Power (W)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
              {['officer', 'admin'].includes(userRole) && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit) => (
                <TableRow 
                  key={unit.unitId} 
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    bgcolor: !unit.status ? 'action.hover' : 'inherit',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  {['officer', 'admin'].includes(userRole) && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(unit.unitId)}
                        onChange={() => handleSelect(unit.unitId)}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell onClick={() => openDashboard(unit.unitId)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlashOnIcon color={unit.status ? 'success' : 'disabled'} fontSize="small" />
                      <Typography fontWeight={500}>{unit.unitId}</Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell onClick={() => openDashboard(unit.unitId)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon color="action" fontSize="small" />
                      {unit.location || '-'}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right" onClick={() => openDashboard(unit.unitId)}>
                    <Chip 
                      label={unit.voltage != null ? unit.voltage.toFixed(1) : '-'} 
                      size="small"
                      variant="outlined"
                      color={unit.voltage > 220 ? 'warning' : 'default'}
                    />
                  </TableCell>
                  
                  <TableCell align="right" onClick={() => openDashboard(unit.unitId)}>
                    {unit.current != null ? unit.current.toFixed(2) : '-'}
                  </TableCell>
                  
                  <TableCell align="right" onClick={() => openDashboard(unit.unitId)}>
                    <Typography fontWeight={600} color={unit.power > 0 ? 'success.main' : 'text.primary'}>
                      {unit.power != null ? unit.power.toFixed(0) : '-'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Switch
                        checked={!!unit.status}
                        onChange={() => toggleStatus(unit.unitId, !!unit.status)}
                        color="success"
                        disabled={userRole === 'user'}
                        size={isMobile ? 'small' : 'medium'}
                        icon={<PowerOffIcon />}
                        checkedIcon={<PowerIcon />}
                      />
                      <Chip 
                        label={unit.status ? 'ON' : 'OFF'} 
                        size="small"
                        color={unit.status ? 'success' : 'default'}
                        sx={{ ml: 1, fontWeight: 500 }}
                      />
                    </Box>
                  </TableCell>

                  {['officer', 'admin'].includes(userRole) && (
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Edit Unit">
                        <IconButton
                          color="primary"
                          size={isMobile ? 'small' : 'medium'}
                          onClick={() => handleEdit(unit)}
                          sx={{ mr: 1 }}
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
                  colSpan={['officer', 'admin'].includes(userRole) ? 8 : 7}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <SolarPowerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No solar units found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {search ? "Try adjusting your search" : 
                      ['officer', 'admin'].includes(userRole) ? 
                      "Click 'Add Solar Unit' to create one" : 
                      "No units assigned to your account"}
                  </Typography>
                  {search && (
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2 }}
                      onClick={() => setSearch('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk Actions */}
      {selected.length > 0 && ['officer', 'admin'].includes(userRole) && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" color="white" fontWeight={500}>
                {selected.length} unit{selected.length > 1 ? 's' : ''} selected
              </Typography>
              <Chip 
                label="Click to deselect" 
                size="small"
                onClick={() => setSelected([])}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
              />
            </Box>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleSelectedUnits}
              size="large"
              startIcon={units.some((u) => selected.includes(u.unitId) && u.status) ? <PowerOffIcon /> : <PowerIcon />}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Turn {units.some((u) => selected.includes(u.unitId) && u.status) ? 'OFF' : 'ON'} All
            </Button>
          </Box>
        </Paper>
      )}

      {/* Floating Action Button for mobile */}
      {isMobile && ['officer', 'admin'].includes(userRole) && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/add-solar-unit')}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}