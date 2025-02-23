import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Badge, Timer } from "lucide-react";
import { API } from "../../api/post";

// Styled components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    {icon}
    <Box sx={{ ml: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Box>
  </Box>
);

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await API.get("/user/profile/");

      if (response.status !== 200)
        throw new Error("Failed to fetch profile data");

      const data = response.data;
      setUserData(data);
      setEditData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await API.put("/user/profile/update/", editData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) throw new Error("Failed to update profile");

      setUserData(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      setUploadLoading(true);
      const response = await API.post("/user/profile/photo/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) throw new Error("Failed to upload photo");

      const updatedData = response.data;
      setUserData(updatedData);
      setOpenPhotoDialog(false);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <ProfileAvatar
                src={
                  userData?.profile_picture
                    ? `data:image/jpeg;base64,${userData.profile_picture}`
                    : null
                }
              >
                {!userData?.profile_picture && (
                  <PersonIcon sx={{ fontSize: 80 }} />
                )}
              </ProfileAvatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "background.paper",
                }}
                onClick={() => setOpenPhotoDialog(true)}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                ml: { sm: 3 },
                mt: { xs: 2, sm: 0 },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography variant="h4" gutterBottom>
                {userData?.role?.name === "Nurse" ? "Ns. " : ""}
                {userData?.first_name} {userData?.last_name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {userData?.role?.name === "Nurse"
                  ? `${userData?.nurse?.level || "Nurse"}`
                  : userData?.management?.position}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userData?.role?.name === "Nurse"
                  ? userData?.nurse?.department?.name
                  : userData?.management?.department?.name}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                position: { sm: "absolute" },
                top: { sm: 16 },
                right: { sm: 16 },
                mt: { xs: 2, sm: 0 },
              }}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <InfoItem
              icon={<Badge sx={{ color: "text.secondary" }} />}
              label="ID"
              value={
                userData?.role?.name === "Nurse"
                  ? userData?.nurse?.nurse_account_id
                  : userData?.management?.management_account_id
              }
            />

            <InfoItem
              icon={<EmailIcon sx={{ color: "text.secondary" }} />}
              label="Email"
              value={userData?.email}
            />

            <InfoItem
              icon={<PhoneIcon sx={{ color: "text.secondary" }} />}
              label="Phone"
              value={userData?.phone}
            />
            {userData?.role?.name === "Nurse" && (
              <InfoItem
                icon={<Timer sx={{ color: "text.secondary" }} />}
                label="Time Of Services"
                value={userData?.nurse?.years_of_service}
              />
            )}

            <InfoItem
              icon={<BusinessIcon sx={{ color: "text.secondary" }} />}
              label="Department"
              value={
                userData?.role?.name === "Nurse"
                  ? userData?.nurse?.department?.name
                  : userData?.management?.department?.name
              }
            />
          </Paper>
        </Grid>

        {/* Role-specific Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {userData?.role?.name === "Nurse"
                ? "Nurse Information"
                : "Management Information"}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {userData?.role?.name === "Nurse" ? (
              <>
                <InfoItem
                  icon={<BadgeIcon sx={{ color: "text.secondary" }} />}
                  label="Current Level"
                  value={userData?.nurse?.level}
                />

                <InfoItem
                  icon={<CalendarIcon sx={{ color: "text.secondary" }} />}
                  label="Level Upgrade Date"
                  value={userData?.nurse?.level_upgrade_date}
                />

                <InfoItem
                  icon={<BusinessIcon sx={{ color: "text.secondary" }} />}
                  label="Specialization"
                  value={userData?.nurse?.specialization}
                />
              </>
            ) : (
              <>
                <InfoItem
                  icon={<BadgeIcon sx={{ color: "text.secondary" }} />}
                  label="Position"
                  value={userData?.management?.position}
                />

                <InfoItem
                  icon={<BusinessIcon sx={{ color: "text.secondary" }} />}
                  label="Department Role"
                  value="Management"
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editMode}
        onClose={() => setEditMode(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editData.first_name}
                onChange={(e) =>
                  setEditData({ ...editData, first_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editData.last_name}
                onChange={(e) =>
                  setEditData({ ...editData, last_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog open={openPhotoDialog} onClose={() => setOpenPhotoDialog(false)}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Choose Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhotoDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePhotoUpload}
            variant="contained"
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
