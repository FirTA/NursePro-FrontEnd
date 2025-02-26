import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  Comment as CommentIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  ArticleOutlined as ArticleIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { API } from '../../api/post';
import useAuth from '../../hooks/useAuth';

const CounselingNotesManagementView = () => {
  const { auth } = useAuth();
  const [counselingSessions, setCounselingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [expandedCounseling, setExpandedCounseling] = useState(null);

  const userRole = auth?.user?.role?.toLowerCase() || auth?.role?.toLowerCase() || '';
  const isManagement = userRole === 'management' || userRole === 'admin';

  // Fetch counseling sessions with notes
  useEffect(() => {
    if (isManagement) {
      fetchCounselingSessions();
    }
  }, [isManagement]);

  const fetchCounselingSessions = async () => {
    try {
      setLoading(true);
      
      let query = '';
      if (searchTerm) {
        query = `?search=${searchTerm}`;
      }
      
      const response = await API.get(`/counseling-results/by-counseling/${query}`);
      setCounselingSessions(response.data.results || []);
    } catch (error) {
      console.error('Error fetching counseling sessions with notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchCounselingSessions();
  };

  // Handle expansion of counseling accordion
  const handleAccordionChange = (counselingId) => (event, isExpanded) => {
    setExpandedCounseling(isExpanded ? counselingId : null);
  };

  // Handle view note details
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setNoteDialogOpen(true);
  };

  // Handle close note dialog
  const handleCloseNoteDialog = () => {
    setNoteDialogOpen(false);
  };

  // If not management, don't show this view
  if (!isManagement) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            You don't have permission to access this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Counseling Sessions with Notes
        </Typography>
        
        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search by session title, nurse, or note content..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      handleSearch();
                    }}
                  >
                    <FilterIcon color="action" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500, mr: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        
        {/* Counseling Sessions with Notes */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : counselingSessions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No counseling sessions with notes found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try modifying your search terms' : 'Notes will appear here once nurses submit them'}
            </Typography>
          </Paper>
        ) : (
          <Box>
            {counselingSessions.map((counseling) => (
              <Accordion 
                key={counseling.id}
                expanded={expandedCounseling === counseling.id}
                onChange={handleAccordionChange(counseling.id)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${counseling.id}-content`}
                  id={`panel-${counseling.id}-header`}
                  sx={{ 
                    '&.Mui-expanded': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="h6">
                          {counseling.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(counseling.scheduled_date).format('DD MMMM YYYY, HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`${counseling.notes_count} Notes`}
                      color="primary"
                      size="small"
                      icon={<NotesIcon />}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  {/* Counseling Details */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardHeader
                          title="Session Details"
                          avatar={<ArticleIcon />}
                        />
                        <Divider />
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Management
                              </Typography>
                              <Typography variant="body1">
                                {counseling.management?.name || 'Not assigned'}
                                {counseling.management?.position && ` (${counseling.management.position})`}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Session Type
                              </Typography>
                              <Typography variant="body1">
                                {counseling.counseling_type?.name || 'Not specified'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Description
                              </Typography>
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {counseling.description || 'No description provided'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardHeader
                          title="Participating Nurses"
                          avatar={<GroupIcon />}
                        />
                        <Divider />
                        <CardContent>
                          {counseling.nurses.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {counseling.nurses.map(nurse => (
                                <Chip
                                  key={nurse.id}
                                  avatar={<Avatar>{nurse.name.charAt(0)}</Avatar>}
                                  label={nurse.name}
                                  variant="outlined"
                                  sx={{ mb: 1 }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No nurses assigned to this session
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  {/* Nurse Notes */}
                  <Typography variant="h6" gutterBottom>
                    Nurse Notes
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {counseling.notes.map(note => (
                      <Grid item xs={12} md={6} key={note.id}>
                        <Card variant="outlined">
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {note.nurse?.name?.charAt(0) || 'N'}
                              </Avatar>
                            }
                            title={note.nurse?.name || 'Unknown Nurse'}
                            subheader={dayjs(note.created_at).format('DD MMM YYYY, HH:mm')}
                            action={
                              <Tooltip title="View Full Note">
                                <IconButton
                                  aria-label="view"
                                  onClick={() => handleViewNote({
                                    ...note,
                                    consultation: {
                                      title: counseling.title,
                                      scheduled_date: counseling.scheduled_date
                                    }
                                  })}
                                >
                                  <CommentIcon />
                                </IconButton>
                              </Tooltip>
                            }
                          />
                          <Divider />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Feedback:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                maxHeight: 100,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {note.nurse_feedback || 'No feedback provided'}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              onClick={() => handleViewNote({
                                ...note,
                                consultation: {
                                  title: counseling.title,
                                  scheduled_date: counseling.scheduled_date
                                }
                              })}
                            >
                              Read More
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Note Detail Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={handleCloseNoteDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {selectedNote && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6">
                Session Notes
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                {selectedNote.consultation?.title || 'Unknown Session'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" component="span">
                      {selectedNote.nurse?.name || 'Unknown Nurse'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Submitted on
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(selectedNote.created_at).format('DD MMMM YYYY, HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {selectedNote.created_at !== selectedNote.updated_at && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last updated
                        </Typography>
                        <Typography variant="body1">
                          {dayjs(selectedNote.updated_at).format('DD MMMM YYYY, HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentIcon sx={{ mr: 1 }} />
                Nurse Feedback
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {selectedNote.nurse_feedback || 'No feedback provided'}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNoteDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default CounselingNotesManagementView;