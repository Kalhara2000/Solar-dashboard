import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

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
  const [success, setSuccess] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

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

    if (!formData.location.trim()) {
      toast.error('Location is required');
      setError('Location is required');
      return;
    }

    setSaving(true);

    try {
      const cleanUnitId = formData.unitId.trim().toUpperCase();

      await api.patch(`/solar-units/${cleanUnitId}`, {
        location: formData.location.trim(),
        capacity: formData.capacity ? Number(formData.capacity) : null,
        description: formData.description.trim(),
      });

      toast.success('Solar unit updated successfully');
      setSuccess(true);

      setTimeout(() => navigate('/solar-units'), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update solar unit';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            Edit Solar Unit
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
              disabled // Cannot change ID after creation
              helperText="Unit ID cannot be changed"
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
              disabled={saving}
              sx={{ mt: 3 }}
            >
              {saving ? <CircularProgress size={22} /> : 'Update Solar Unit'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/solar-units')}
              sx={{ mt: 2 }}
            >
              Cancel & Go Back
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}