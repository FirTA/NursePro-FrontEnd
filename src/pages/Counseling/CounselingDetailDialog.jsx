import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Paper,
  Grid,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Download,
  Event as EventIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  FileCopy as FileIcon,
  Person as PersonIcon,
  Note as NoteIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import CounselingResultForm from './CounselingResultForm';

const CounselingDetailDialog = ({ 
  open, 
  onClose, 
  counseling, 
  isNurse, 
  isManagement, 
  handleDownload,
  handleMarkAsCompleted 
}) => {
  const [resultFormOpen, setResultFormOpen] = useState(false);
  
  // Only return null if there's no counseling data to display
  if (!counseling) return null;
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return "success";  // Scheduled
      case 2: return "warning";  // In Progress
      case 3: return "success";  // Completed
      default: return "default";
    }
  };
  
  // Check if the counseling is completed (status 3)
  const isCompleted = counseling?.status === 3;
  
  // Check if current time is after scheduled time
  const isTimeElapsed = counseling?.scheduled_date 
    ? dayjs().isAfter(dayjs(counseling.scheduled_date)) 
    : false;
  
  // Handle create note result
  const handleCreateNoteResult = () => {
    setResultFormOpen(true);
  };

  // Determine if the "Create Note Result" button should be enabled
  // Only nurses can create notes and only when the session is completed
  const canCreateNotes = isNurse && isCompleted;
  
  // Determine if "Mark as Completed" button should be shown
  // Only management can mark as completed and only when the scheduled time has passed
  const canMarkAsCompleted = isManagement && !isCompleted && isTimeElapsed;
  
  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
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
            {counseling?.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Chip
              label={counseling?.status_display}
              color={getStatusColor(counseling?.status)}
              size="small"
            />
            {isCompleted && (
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                  Completed
                </Typography>
              </Box>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Left column - Session details */}
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {counseling?.description || "No description provided"}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CategoryIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Type
                    </Typography>
                    <Chip 
                      label={counseling?.counseling_type_display} 
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EventIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Scheduled Date
                    </Typography>
                    <Typography variant="body1">
                      {counseling?.scheduled_date
                        ? dayjs(counseling.scheduled_date).format("DD MMMM YYYY HH:mm")
                        : "Not scheduled yet"}
                    </Typography>
                    {isTimeElapsed && !isCompleted && (
                      <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Scheduled time has passed
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Management
                    </Typography>
                    <Typography variant="body1">
                      {counseling?.management?.name || "No management assigned"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {counseling?.management?.position || ""}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              {/* Nurses List */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" component="div">
                    Nurses
                  </Typography>
                </Box>
                
                {counseling?.nurses && counseling.nurses.length > 0 ? (
                  <List>
                    {counseling.nurses.map((nurse, index) => (
                      <React.Fragment key={nurse.id || index}>
                        <ListItem 
                          sx={{ 
                            bgcolor: 'background.paper', 
                            borderRadius: 1,
                            py: 1
                          }}
                        >
                          <Avatar sx={{ mr: 2, bgcolor: 'info.light' }}>
                            {nurse.name ? nurse.name.charAt(0).toUpperCase() : 'N'}
                          </Avatar>
                          <ListItemText 
                            primary={nurse.name || "Unknown Name"} 
                            secondary={nurse.department || "No department"}
                          />
                          <Chip 
                            size="small" 
                            label={nurse.level || "Nurse"} 
                            variant="outlined" 
                            color="info"
                          />
                        </ListItem>
                        {index < counseling.nurses.length - 1 && (
                          <Divider component="li" sx={{ my: 0.5 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ 
                    py: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column', 
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <GroupIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
                    <Typography>No nurses assigned</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Right column - Materials */}
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" component="div">
                    Materials
                  </Typography>
                </Box>
                
                {counseling?.materials_files?.length > 0 ? (
                  <List>
                    {counseling.materials_files.map((file, index) => (
                      <React.Fragment key={file.id || index}>
                        <ListItem 
                          sx={{ 
                            bgcolor: 'background.paper', 
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                            <FileIcon />
                          </Avatar>
                          <ListItemText 
                            primary={file.title} 
                            secondary={`Added on ${dayjs(file.created_at).format("DD MMM YYYY") || "Unknown date"}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleDownload(file.file_path)}
                              color="primary"
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: 'primary.light', 
                                  color: 'primary.contrastText' 
                                } 
                              }}
                            >
                              <Download />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < counseling.materials_files.length - 1 && (
                          <Divider component="li" sx={{ my: 1 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ 
                    py: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column', 
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}>
                    <FileIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
                    <Typography>No materials available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
          <Button onClick={onClose} variant="outlined">Close</Button>
          
          {canMarkAsCompleted && (
            <Button 
              variant="contained" 
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleMarkAsCompleted(counseling.id)}
            >
              Mark as Completed
            </Button>
          )}
          
          {isNurse && (
            <Tooltip title={
              !isCompleted 
                ? "Notes can only be created when the session is marked as completed" 
                : "Create notes for this counseling session"
            }>
              <span>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<NoteIcon />}
                  onClick={handleCreateNoteResult}
                  disabled={!canCreateNotes}
                >
                  Create Note Result
                </Button>
              </span>
            </Tooltip>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Session Notes Form */}
      {resultFormOpen && (
        <CounselingResultForm
          open={resultFormOpen}
          onClose={(refreshNeeded) => {
            setResultFormOpen(false);
            if (refreshNeeded) {
              // You can trigger any refresh logic here if needed
            }
          }}
          counseling={counseling}
        />
      )}
    </>
  );
};

export default CounselingDetailDialog;