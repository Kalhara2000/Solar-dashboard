import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <SolarPowerIcon sx={{ mr: 1.5, fontSize: 32 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CEB Solar Management
        </Typography>

        <Button color="inherit" component={RouterLink} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={RouterLink} to="/solar-units">
          Solar Units
        </Button>
        <Button color="inherit" component={RouterLink} to="/add-solar">
          Add Unit
        </Button>

        <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}