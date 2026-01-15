import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unitId' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.unitId || !formData.location) {
      toast.error('Unit ID and Location are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/solar-units', formData);
      toast.success('Solar unit added successfully');
      setSuccess(true);

      setTimeout(() => navigate('/solar-units'), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add solar unit';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" mb={2}>
            Add Solar Unit
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Redirecting...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Unit ID"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Capacity (kW)"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={22} /> : 'Add Solar Unit'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
