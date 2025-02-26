import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Event as EventIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  NotificationsActive as NotificationsActiveIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon,
  Visibility as VisibilityIcon,
  NoteAdd as NoteAddIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  BusinessCenter as BusinessCenterIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { API } from '../../api/post';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NurseDashboard = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    nurseInfo: {
      name: '',
      level: '',
      levelProgress: 0,
      nextLevelDate: null,
      yearsOfService: 0,
      department: '',
      specialization: ''
    },
    counselingSessions: {
      upcoming: [],
      completed: [],
      needNotes: []
    },
    stats: {
      totalSessions: 0,
      completedSessions: 0,
      pendingNotes: 0
    }
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/dashboard/nurse/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = (counselingId) => {
    navigate(`/counseling/note/${counselingId}`);
  };

  const handleViewSession = (sessionId) => {
    navigate(`/counseling/${sessionId}`);
  };

  const formatTimeRemaining = (dateString) => {
    if (!dateString) return 'N/A';
    
    const targetDate = dayjs(dateString);
    const now = dayjs();
    
    const days = targetDate.diff(now, 'day');
    const months = targetDate.diff(now, 'month');
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ${days % 30} day${days % 30 !== 1 ? 's' : ''}`;
    }
    
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {dashboardData.nurseInfo.name}
        </Typography>

        {/* Nurse Info Card */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {dashboardData.nurseInfo.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {dashboardData.nurseInfo.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {dashboardData.nurseInfo.department}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  Current Level: <strong>{dashboardData.nurseInfo.level}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessCenterIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  Years of Service: <strong>{dashboardData.nurseInfo.yearsOfService}</strong>
                </Typography>
              </Box>
              
              {dashboardData.nurseInfo.specialization && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body1">
                    Specialization: <strong>{dashboardData.nurseInfo.specialization}</strong>
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Level Progression
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={dashboardData.nurseInfo.levelProgress} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'success.main'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData.nurseInfo.levelProgress}%
                  </Typography>
                </Box>
                
                {dashboardData.nurseInfo.nextLevelDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DateRangeIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Eligible for next level in{' '}
                      <strong>
                        {formatTimeRemaining(dashboardData.nurseInfo.nextLevelDate)}
                      </strong>
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="primary.contrastText" variant="subtitle2">
                          Total Sessions
                        </Typography>
                        <EventIcon color="primary" />
                      </Box>
                      <Typography variant="h4" color="primary.main" sx={{ mt: 1 }}>
                        {dashboardData.stats.totalSessions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="success.contrastText" variant="subtitle2">
                          Completed
                        </Typography>
                        <AssignmentTurnedInIcon color="success" />
                      </Box>
                      <Typography variant="h4" color="success.main" sx={{ mt: 1 }}>
                        {dashboardData.stats.completedSessions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="warning.contrastText" variant="subtitle2">
                          Pending Notes
                        </Typography>
                        <NotificationsActiveIcon color="warning" />
                      </Box>
                      <Typography variant="h4" color="warning.main" sx={{ mt: 1 }}>
                        {dashboardData.stats.pendingNotes}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Alert for Sessions Needing Notes */}
        {dashboardData.counselingSessions.needNotes.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 4 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/session-notes')}
              >
                View All
              </Button>
            }
          >
            <AlertTitle>Attention Required</AlertTitle>
            You have {dashboardData.counselingSessions.needNotes.length} completed session{dashboardData.counselingSessions.needNotes.length > 1 ? 's' : ''} that need{dashboardData.counselingSessions.needNotes.length === 1 ? 's' : ''} notes.
            Please complete them as soon as possible.
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Upcoming Sessions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Upcoming Counseling Sessions
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/counseling')}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {dashboardData.counselingSessions.upcoming.length > 0 ? (
                <List>
                  {dashboardData.counselingSessions.upcoming.map((session) => (
                    <ListItem
                      key={session.id}
                      sx={{ 
                        mb: 1, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={session.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {dayjs(session.scheduled_date).format('DD MMM YYYY, HH:mm')}
                            </Typography>
                            {` — ${session.type}`}
                          </>
                        }
                      />
                      {/* <ListItemSecondaryAction>
                        <Tooltip title="View Session Details">
                          <IconButton edge="end" onClick={() => handleViewSession(session.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction> */}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventNoteIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    No upcoming counseling sessions
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sessions Needing Notes */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Sessions Needing Notes
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/session-notes')}
                  disabled={dashboardData.counselingSessions.needNotes.length === 0}
                >
                  All My Notes
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {dashboardData.counselingSessions.needNotes.length > 0 ? (
                <List>
                  {dashboardData.counselingSessions.needNotes.map((session) => (
                    <ListItem
                      key={session.id}
                      sx={{ 
                        mb: 1, 
                        border: '1px solid', 
                        borderColor: 'warning.main',
                        borderRadius: 1,
                        bgcolor: 'warning.lighter',
                        '&:hover': { bgcolor: 'warning.light' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={session.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {dayjs(session.scheduled_date).format('DD MMM YYYY')}
                            </Typography>
                            {` — Completed but needs notes`}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        {/* <Tooltip title="Create Session Notes">
                          <IconButton 
                            edge="end" 
                            color="warning"
                            onClick={() => handleCreateNote(session.id)}
                          >
                            <NoteAddIcon />
                          </IconButton>
                        </Tooltip> */}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'success.light', mb: 1 }} />
                  <Typography color="text.secondary">
                    No pending notes - all caught up!
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Completed Sessions with Notes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recently Completed Sessions
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {dashboardData.counselingSessions.completed.length > 0 ? (
                <Grid container spacing={2}>
                  {dashboardData.counselingSessions.completed.map((session) => (
                    <Grid item xs={12} md={6} lg={4} key={session.id}>
                      <Card variant="outlined">
                        <CardHeader
                          title={session.title}
                          subheader={dayjs(session.scheduled_date).format('DD MMMM YYYY')}
                          // action={
                          //   <IconButton 
                          //     aria-label="view"
                          //     onClick={() => handleViewSession(session.id)}
                          //   >
                          //     <VisibilityIcon />
                          //   </IconButton>
                          // }
                        />
                        <Divider />
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Type:
                              </Typography>
                              <Chip 
                                label={session.type}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Notes Status:
                              </Typography>
                              <Chip 
                                label={session.hasNotes ? "Notes Submitted" : "Missing Notes"}
                                size="small"
                                color={session.hasNotes ? "success" : "error"}
                              />
                            </Box>
                          </Box>
                          {session.noteContent && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Your Notes:
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  mt: 0.5,
                                  maxHeight: 60,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  bgcolor: 'action.hover',
                                  p: 1,
                                  borderRadius: 1
                                }}
                              >
                                {session.noteContent}
                              </Typography>
                              <Button
                                startIcon={<EditIcon />}
                                size="small"
                                sx={{ mt: 1 }}
                                onClick={() => navigate(`/session-notes?id=${session.noteId}`)}
                              >
                                View/Edit Note
                              </Button>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventNoteIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    No recently completed counseling sessions
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NurseDashboard;