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
  CircularProgress
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function EditUser() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadUser();
     // eslint-disable-next-line
  }, [uid]);

  const loadUser = async () => {
    try {
      const { data } = await api.get(`/users/${uid}`);

      setUser({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "officer",
      });

      setLoading(false);
    } catch (err) {
      toast.error("Failed to load user");
      navigate("/users");
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/users/${uid}`, user);

      toast.success("User updated successfully");
      navigate("/users");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 5 }}>
          <Typography variant="h5" mb={3}>
            Edit User
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              value={user.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              value={user.email}
              disabled
            />

            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              margin="normal"
              value={user.role}
              onChange={handleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="officer">Officer</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
              >
                Update
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate("/user-management")}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
}