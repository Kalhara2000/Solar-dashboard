import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Alert, Box, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddSolarUnit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    unitId: '',
    location: '',
    capacity: '',      // kW - optional
    description: ''    // optional
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!formData.unitId.trim() || !formData.location.trim()) {
      setError('Unit ID and Location are required');
      setLoading(false);
      return;
    }

    try {
      await api.post('/solar/add', {
        unitId: formData.unitId.trim().toUpperCase(),
        location: formData.location.trim(),
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        description: formData.description.trim() || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/solar-units');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add solar unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Add New Solar Unit
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Solar unit added successfully! Redirecting...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Unit ID"
          name="unitId"
          margin="normal"
          value={formData.unitId}
          onChange={handleChange}
          required
          helperText="Will be converted to uppercase"
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />

        <TextField
          fullWidth
          label="Location / Site Name"
          name="location"
          margin="normal"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Installed Capacity (kW)"
          name="capacity"
          type="number"
          margin="normal"
          value={formData.capacity}
          onChange={handleChange}
          helperText="Optional - Installed capacity in kilowatts"
        />

        <TextField
          fullWidth
          label="Description / Notes"
          name="description"
          margin="normal"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          disabled={loading}
          sx={{ mt: 4, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Solar Unit'}
        </Button>
      </Box>
    </Container>
  );
}