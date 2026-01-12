import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0ff' }}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <SolarPowerIcon
          sx={{
            mr: 1.5,
            fontSize: 32,
            color: 'white',
            '&:hover': {
              color: 'yellow',
            },
          }}
        />

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          CEB Solar
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button color="inheri" component={RouterLink} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/solar-units">
            Solar Units
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-solar">
            Add Unit
          </Button>

          <IconButton onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </IconButton>

        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'flex', md: 'none' } }}
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
        >
          <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose}>
            Dashboard
          </MenuItem>
          <MenuItem component={RouterLink} to="/solar-units" onClick={handleMenuClose}>
            Solar Units
          </MenuItem>
          <MenuItem component={RouterLink} to="/add-solar" onClick={handleMenuClose}>
            Add Unit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout();
            }}
            sx={{
              color: 'red',
              '&:hover': {
                backgroundColor: 'rgba(255,0,0,0.1)', // light red hover
              },
            }}
          >
            Logout
          </MenuItem>

        </Menu>
      </Toolbar>
    </AppBar>
  );
}
