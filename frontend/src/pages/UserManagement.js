// src/pages/UserManagement.js

import { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isMobile = useMediaQuery("(max-width:600px)");

  // ==============================
  // Protect page (Admin only)
  // ==============================
  useEffect(() => {
    if (userRole !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/");
    }
  }, [userRole, navigate]);

  // ==============================
  // Load Users
  // ==============================
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      
      // Sort users by creation date (newest first)
      const sortedUsers = (data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ==============================
  // Delete User
  // ==============================
  const handleDelete = (uid) => {
    setUserToDelete(uid);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);
      setUsers((prev) => prev.filter((u) => u.uid !== userToDelete));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // ==============================
  // Edit User
  // ==============================
  const handleEdit = (user) => {
    navigate(`/edit-user/${user.uid}`);
  };

  // ==============================
  // Format Date
  // ==============================
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    
    try {
      let date;
      
      if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        return "Invalid date";
      }
      
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(dateValue);
    }
  };

  // ==============================
  // Search Filter
  // ==============================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.uid?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // Loading State
  // ==============================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
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
          Delete User
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone and will permanently remove the user from both Authentication
            and Database.
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          User Management
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/add-user")}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Add New User
        </Button>
      </Box>

      {/* Search and Stats */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
        <TextField
          fullWidth
          label="Search by Name, Email, UID, or Role"
          size="medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 500 }}
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          Total Users: {filteredUsers.length} / {users.length}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email Verified</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell> */}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Last Sign In</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.uid} 
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: user.disabled ? 'action.disabledBackground' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{user.name || "N/A"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.uid.substring(0, 8)}...
                    </Typography>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Chip 
                      label={user.role || "user"} 
                      size="small"
                      color={user.role === "admin" ? "secondary" : "default"}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>

                  {/* <TableCell>
                    {user.emailVerified ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography variant="body2">Verified</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CancelIcon color="error" fontSize="small" />
                        <Typography variant="body2">Unverified</Typography>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={user.disabled ? "Disabled" : "Active"}
                      size="small"
                      color={user.disabled ? "error" : "success"}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell> */}

                  <TableCell>{formatDate(user.createdAt)}</TableCell>

                  <TableCell>
                    {user.lastSignIn ? formatDate(user.lastSignIn) : "Never"}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit User">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={user.disabled ? "Cannot delete disabled user" : "Delete User"}>
                      <span>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user.uid)}
                          disabled={user.disabled}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {search ? "Try adjusting your search" : "Click 'Add New User' to create one"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}