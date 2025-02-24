import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { API } from '../../api/post';
import { useNavigate } from 'react-router-dom';

const ManagementDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    counselingStats: {
      total: 0,
      completed: 0,
      scheduled: 0,
      pendingNotes: 0
    },
    nurseStats: {
      total: 0,
      byLevel: []
    },
    recentCounseling: [],
    upcomingCounseling: [],
    counselingByMonth: [],
    counselingByType: []
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/dashboard/management/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
          Management Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom color="primary.contrastText">
                    Total Counseling Sessions
                  </Typography>
                  <AssessmentIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h3" component="div" color="primary.main">
                  {dashboardData.counselingStats.total}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData.counselingStats.completed} completed
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom color="info.contrastText">
                    Upcoming Sessions
                  </Typography>
                  <EventIcon fontSize="large" color="info" />
                </Box>
                <Typography variant="h3" component="div" color="info.main">
                  {dashboardData.counselingStats.scheduled}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Scheduled for next 30 days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom color="warning.contrastText">
                    Pending Notes
                  </Typography>
                  <AssignmentIcon fontSize="large" color="warning" />
                </Box>
                <Typography variant="h3" component="div" color="warning.main">
                  {dashboardData.counselingStats.pendingNotes}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TimelineIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Awaiting nurse feedback
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom color="success.contrastText">
                    Total Nurses
                  </Typography>
                  <GroupIcon fontSize="large" color="success" />
                </Box>
                <Typography variant="h3" component="div" color="success.main">
                  {dashboardData.nurseStats.total}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Across all departments
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Counseling Sessions by Month
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.counselingByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#8884d8" />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Counseling by Type
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.counselingByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.counselingByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Lists Row */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
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
              
              {dashboardData.upcomingCounseling.length > 0 ? (
                <List>
                  {dashboardData.upcomingCounseling.map((session) => (
                    <ListItem
                      key={session.id}
                      // secondaryAction={
                      //   <Tooltip title="View Details">
                      //     <IconButton edge="end" aria-label="view" onClick={() => navigate(`/counseling/${session.id}`)}>
                      //       <VisibilityIcon />
                      //     </IconButton>
                      //   </Tooltip>
                      // }
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
                            {` — ${session.nurses.length} nurses assigned`}
                          </>
                        }
                      />
                      <Chip 
                        label={session.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No upcoming counseling sessions scheduled
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Completed Sessions
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/session-notes/by-counseling')}
                >
                  View All Notes
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {dashboardData.recentCounseling.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Nurses</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.recentCounseling.map((session) => (
                        <TableRow key={session.id} hover>
                          <TableCell>{session.title}</TableCell>
                          <TableCell>{dayjs(session.scheduled_date).format('DD MMM YY')}</TableCell>
                          <TableCell>{session.nurses.length}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={`${session.notes_count}/${session.nurses.length}`}
                              color={session.notes_count === session.nurses.length ? "success" : "warning"}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/session-notes/by-counseling?session=${session.id}`)}
                            >
                              <AssignmentIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No recently completed counseling sessions
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ManagementDashboard;