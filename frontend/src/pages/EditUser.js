// pages/EditUser.js
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditUser() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    cebId: "",
    disabled: false,
  });

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, [uid]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data from your users endpoint
      const { data } = await api.get(`/users/${uid}`);
      
      setUser({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
        cebId: data.cebId || "",
        disabled: data.disabled || false,
      });
    } catch (err) {
      console.error("Failed to load user:", err);
      const errorMessage = err.response?.data?.error || "Failed to load user";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Only navigate back if user doesn't exist
      if (err.response?.status === 404) {
        setTimeout(() => navigate("/user-management"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name
    if (!user.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Send only updatable fields
      await api.patch(`/users/${uid}`, {
        name: user.name.trim(),
        role: user.role,
      });

      toast.success("User updated successfully");
      navigate("/user-management");
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.error || "Failed to update user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header with back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/user-management")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Edit User
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Disabled User Warning */}
      {user.disabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This user account is disabled. Some changes may be limited.
        </Alert>
      )}

      {/* Edit Form */}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            value={user.name}
            onChange={handleChange}
            required
            disabled={submitting}
            variant="outlined"
          />

          {/* Email Field (Read-only) */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={user.email}
            disabled={true}
            variant="outlined"
            helperText="Email cannot be changed"
          />

          {/* CEB ID Field (Read-only) */}
          <TextField
            fullWidth
            label="CEB ID"
            name="cebId"
            margin="normal"
            value={user.cebId}
            disabled={true}
            variant="outlined"
            helperText="CEB ID cannot be changed"
          />

          {/* Role Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={user.role}
              onChange={handleChange}
              label="Role"
              disabled={submitting}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.5 }}
            >
              {submitting ? <CircularProgress size={24} /> : "Update User"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/user-management")}
              disabled={submitting}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}