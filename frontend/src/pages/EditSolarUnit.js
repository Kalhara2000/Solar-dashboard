// EditSolarUnit.js

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DescriptionIcon from '@mui/icons-material/Description';

export default function EditSolarUnit() {
  const { unitId } = useParams(); // From URL: /edit-solar/:unitId
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    unitId: '',
    location: '',
    capacity: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const { data } = await api.get(`/solar-units/${unitId}`);
        if (!data) throw new Error('Unit not found');

        setFormData({
          unitId: data.unitId || unitId,
          location: data.location || '',
          capacity: data.capacity || '',
          description: data.description || '',
        });
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load solar unit';
        setError(msg);
        toast.error(msg);
        
        // Navigate back after error
        setTimeout(() => navigate('/solar-units'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unitId' ? value.toUpperCase() : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.location.trim()) {
      setError('Location is required');
      toast.error('Location is required');
      return false;
    }
    if (formData.capacity && (isNaN(formData.capacity) || Number(formData.capacity) <= 0)) {
      setError('Capacity must be a positive number');
      toast.error('Capacity must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const cleanUnitId = formData.unitId.trim().toUpperCase();

      await api.patch(`/solar-units/${cleanUnitId}`, {
        location: formData.location.trim(),
        capacity: formData.capacity ? Number(formData.capacity) : null,
        description: formData.description.trim(),
      });

      toast.success(
        <div>
          <strong>Solar unit updated successfully!</strong>
          <br />
          <small>Unit ID: {formData.unitId}</small>
        </div>
      );

      // Navigate back to solar units list
      setTimeout(() => navigate('/solar-units'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      const msg = err.response?.data?.error || 'Failed to update solar unit';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/solar-units')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Edit Solar Unit
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Unit ID Field (Read-only) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Unit ID"
                name="unitId"
                value={formData.unitId}
                onChange={handleChange}
                required
                disabled={true}
                variant="outlined"
                InputProps={{
                  startAdornment: <FlashOnIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
                helperText="Unit ID cannot be changed"
              />
            </Grid>

            {/* Location Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={saving}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
                helperText="Installation location"
              />
            </Grid>

            {/* Capacity Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity (kW)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                variant="outlined"
                disabled={saving}
                helperText="Power capacity in kilowatts"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            {/* Empty grid item for spacing */}
            <Grid item xs={12} md={6} />

            {/* Description Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                disabled={saving}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                }}
                helperText="Additional details about the solar unit (optional)"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ 
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {saving ? 'Updating...' : 'Update Solar Unit'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/solar-units')}
              disabled={saving}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" display="block" align="center">
            <SolarPowerIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Only location, capacity, and description can be modified. Unit ID is permanent.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}