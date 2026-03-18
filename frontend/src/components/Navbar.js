// Navbar.js

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SolarPanelsIcon from '@mui/icons-material/SolarPower';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const uid = localStorage.getItem('uid');

    setUserRole(role);
    setUserName(name || 'User');

    // Fetch complete user data from backend
    const fetchUserData = async () => {
      if (uid) {
        try {
          const { data } = await api.get(`/users/${uid}`);
          // Update userName with data from backend if available
          if (data.name) {
            setUserName(data.name);
            localStorage.setItem('userName', data.name);
          }
          // Update userRole if available
          if (data.role) {
            setUserRole(data.role);
            localStorage.setItem('userRole', data.role);
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleMenuClose(); // Close mobile menu if open
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCebId');
    localStorage.removeItem('uid');
    setLogoutDialogOpen(false);
    navigate('/', { replace: true });
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ef5350'; // Red for admin
      case 'officer':
        return '#4caf50'; // Green for officer
      default:
        return '#ffb74d'; // Orange for other roles
    }
  };

  // Get role background color
  const getRoleBgColor = (role) => {
    switch (role) {
      case 'admin':
        return 'rgba(239, 83, 80, 0.2)'; // Red with opacity
      case 'officer':
        return 'rgba(76, 175, 80, 0.2)'; // Green with opacity
      default:
        return 'rgba(255, 183, 77, 0.2)'; // Orange with opacity
    }
  };

  // Navigation items configuration
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon, roles: ['admin', 'officer'] },
    { path: '/solar-units', label: 'Solar Units', icon: SolarPanelsIcon, roles: ['admin', 'officer'] },
    { path: '/add-solar', label: 'Add Unit', icon: AddIcon, roles: ['admin', 'officer'] },
    { path: '/user-management', label: 'User Management', icon: PeopleIcon, roles: ['admin'] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'error.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2
        }}>
          <ExitToAppIcon />
          <Typography variant="h6" component="span" fontWeight={600}>
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <DialogContentText sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
            Are you sure you want to logout?
          </DialogContentText>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              You will be redirected to the login page.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: 2,
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(239, 83, 80, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(239, 83, 80, 0.4)',
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => navigate('/dashboard')}
          >
            <SolarPowerIcon
              sx={{
                mr: 1.5,
                fontSize: 32,
                color: 'white',
                '&:hover': { color: 'yellow' },
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                color: 'white',
              }}
            >
              CEB Solar
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            ml: 4,
          }}>
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={RouterLink}
                to={item.path}
                startIcon={<item.icon />}
                sx={{
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* User Info & Logout - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Fade in={true}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {userName}
                  </Typography>
                  <Chip
                    label={userRole}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.625rem',
                      bgcolor: getRoleBgColor(userRole),
                      color: getRoleColor(userRole),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      border: `1px solid ${getRoleColor(userRole)}`,
                    }}
                  />
                </Box>
              </Box>
            </Fade>

            <IconButton
              onClick={handleLogoutClick}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ff5252',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                bgcolor: 'primary.main',
              }
            }}
          >
            {/* User Info in Mobile Menu */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'white', color: 'primary.main' }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {userName}
                  </Typography>
                  <Chip
                    label={userRole || 'user'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.625rem',
                      bgcolor: getRoleBgColor(userRole),
                      color: getRoleColor(userRole),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      border: `1px solid ${getRoleColor(userRole)}`,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {filteredNavItems.map((item) => (
              <MenuItem
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={handleMenuClose}
                sx={{
                  py: 1.5,
                  color: 'white',
                  gap: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <item.icon sx={{ fontSize: 20, color: 'white' }} />
                <Typography sx={{ color: 'white' }}>
                  {item.label}
                </Typography>
              </MenuItem>
            ))}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

            <MenuItem
              onClick={handleLogoutClick}
              sx={{
                py: 1.5,
                color: '#ff5252',
                gap: 1.5,
                '&:hover': { backgroundColor: 'rgba(255, 82, 82, 0.2)' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}