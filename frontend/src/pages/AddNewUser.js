// src/pages/AddNewUser.js

import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function AddNewUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cebId: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [passwordError, setPasswordError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear password error when typing in password fields
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
    // Clear general error when typing
    setError("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.cebId.trim()) {
      setError("CEB ID is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        cebId: formData.cebId.trim(),
        password: formData.password,
        role: formData.role,
      });

      toast.success(
        <div>
          <strong>User created successfully!</strong>
          <br />
          <small>Role: {response.data.role}</small>
        </div>
      );

      // Navigate back to user management
      navigate("/users");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.error || "Failed to create user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          Add New User
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            disabled={loading}
            autoFocus
            helperText="Enter user's full name"
          />

          {/* CEB ID Field */}
          <TextField
            fullWidth
            label="CEB ID"
            name="cebId"
            value={formData.cebId}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            disabled={loading}
            helperText="Unique CEB identification number"
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />

          {/* Role Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              disabled={loading}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>
              {formData.role === "admin" 
                ? "Admin has full system access (limited to 2 admins total)" 
                : "Regular user with standard permissions"}
            </FormHelperText>
          </FormControl>

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            disabled={loading}
            helperText="Minimum 6 characters"
          />

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={!!passwordError}
            helperText={passwordError || "Re-enter password to confirm"}
          />

          {/* Submit Button */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              sx={{ 
                py: 1.5,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" }
              }}
            >
              {loading ? "Creating User..." : "Create User"}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/user-management")}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </form>

        {/* Additional Info */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="caption" color="text.secondary" display="block" align="center">
            Note: The user's email will be automatically generated as {formData.cebId || "[CEB_ID]"}@ceb.local
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}