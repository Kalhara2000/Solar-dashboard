// src/pages/UserManagement.js
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isMobile = useMediaQuery('(max-width:600px)');

  // Only admin can access
  useEffect(() => {
    if (userRole !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/'); // redirect to homepage or another page
    }
  }, [userRole, navigate]);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users'); // your backend route for users
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
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
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        gutterBottom
        fontWeight={600}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        User Management
      </Typography>

      <TextField
        fullWidth
        label="Search by Name or Email"
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
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontSize: { xs: '0.85rem', sm: '1rem' } }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>{user.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>{user.email}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>{user.role}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit User">
                      <IconButton color="primary" size={isMobile ? 'small' : 'medium'} onClick={() => handleEdit(user)}>
                        <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton color="error" size={isMobile ? 'small' : 'medium'} onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}