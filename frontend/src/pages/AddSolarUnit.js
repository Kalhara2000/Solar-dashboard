// AddSolarUnit.js

import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

export default function AddSolarUnit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    unitId: '',
    location: '',
    capacity: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!formData.unitId.trim()) {
      setError('Unit ID is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (formData.capacity && (isNaN(formData.capacity) || Number(formData.capacity) <= 0)) {
      setError('Capacity must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/solar-units', {
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : null,
      });
      
      toast.success(
        <div>
          <strong>Solar unit added successfully!</strong>
          <br />
          <small>Unit ID: {formData.unitId}</small>
        </div>
      );

      // Navigate back to solar units list
      setTimeout(() => navigate('/solar-units'), 1500);
    } catch (err) {
      console.error('Add solar unit error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add solar unit';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          Add Solar Unit
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
            {/* Unit ID Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unit ID"
                name="unitId"
                value={formData.unitId}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                autoFocus
                helperText="Unique identifier for the solar unit"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            {/* Location Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
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
                disabled={loading}
                helperText="Optional: Power capacity in kilowatts"
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
                disabled={loading}
                multiline
                rows={4}
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
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SolarPowerIcon />}
              sx={{ 
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {loading ? 'Adding Solar Unit...' : 'Add Solar Unit'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/solar-units')}
              disabled={loading}
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
            Solar units are used to track energy generation and maintenance schedules
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}