import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  CircularProgress,
  Alert,
  Chip 
} from '@mui/material';
import { 
  Description as DescriptionIcon, 
  Person as PersonIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { API } from '../../api/post';
import useAuth from '../../hooks/useAuth';

const CounselingResultForm = ({ open, onClose, counseling }) => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    nurse_feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (counseling?.id && open) {
      fetchPreviousFeedback();
    }
  }, [counseling, open]);

  const fetchPreviousFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/counseling-results/${counseling.id}/nurse/${auth.nurse_id}/`);
      if (response.data) {
        setPreviousFeedback(response.data);
        setFormData({
          nurse_feedback: response.data.nurse_feedback || ''
        });
      } else {
        setPreviousFeedback(null);
        setFormData({ nurse_feedback: '' });
      }
    } catch (error) {
      console.error('Error fetching previous feedback:', error);
      // If 404, it means no previous feedback exists
      if (error.response && error.response.status === 404) {
        setPreviousFeedback(null);
        setFormData({ nurse_feedback: '' });
      } else {
        setError('Failed to load previous feedback. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nurse_feedback.trim()) {
      setError('Feedback is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      const payload = {
        consultation_id: counseling.id,
        nurse_id: auth.nurse_id,
        nurse_feedback: formData.nurse_feedback
      };

      if (previousFeedback) {
        // Update existing feedback
        await API.put(`/counseling-results/${previousFeedback.id}/`, payload);
      } else {
        // Create new feedback
        await API.post('/counseling-results/', payload);
      }

      setSuccess(true);
      // Wait a moment to show success message before closing
      setTimeout(() => {
        onClose(true); // Pass true to indicate changes were made
      }, 1500);
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError('Failed to save feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return "success";
      case 2: return "warning";
      case 3: return "error";
      default: return "default";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => !isSubmitting && onClose()} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        py: 2,
        px: 3
      }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
          Session Notes: {counseling?.title}
        </Typography>
        <Chip
          label={counseling?.status_display}
          color={getStatusColor(counseling?.status)}
          size="small"
          sx={{ mt: 1 }}
        />
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Session Information */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="h6">Session Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled Date
                  </Typography>
                  <Typography>
                    {counseling?.scheduled_date
                      ? dayjs(counseling.scheduled_date).format("DD MMMM YYYY HH:mm")
                      : "Not scheduled"}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Management
                  </Typography>
                  <Typography>
                    {counseling?.management?.name || "No management assigned"}
                    {counseling?.management?.position && ` - ${counseling.management.position}`}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Note Status
                  </Typography>
                  <Typography>
                    {previousFeedback ? (
                      <Chip 
                        label="Feedback already submitted" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    ) : (
                      <Chip 
                        label="No feedback submitted yet" 
                        color="warning" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Feedback successfully saved!
              </Alert>
            )}

            {/* Feedback Form */}
            <Typography variant="h6" gutterBottom>
              Your Notes
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please provide detailed notes about this counseling session. Include observations, 
              recommendations, and any follow-up actions needed.
            </Typography>
            
            <TextField
              label="Session Notes"
              multiline
              rows={8}
              fullWidth
              value={formData.nurse_feedback}
              onChange={(e) => setFormData({ ...formData, nurse_feedback: e.target.value })}
              placeholder="Enter your detailed notes about this counseling session..."
              disabled={isSubmitting}
              required
              error={error && !formData.nurse_feedback.trim()}
              helperText={error && !formData.nurse_feedback.trim() ? "Feedback is required" : ""}
              sx={{ mb: 2 }}
            />
            
            {previousFeedback && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {dayjs(previousFeedback.updated_at).format("DD MMM YYYY HH:mm")}
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
        <Button onClick={() => onClose()} disabled={isSubmitting} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting || isLoading}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSubmitting ? 'Saving...' : previousFeedback ? 'Update Notes' : 'Save Notes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounselingResultForm;