import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  Comment as CommentIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { API } from '../../api/post';
import useAuth from '../../hooks/useAuth';

const SessionNotesPage = () => {
  const { auth } = useAuth();
  const [sessionNotes, setSessionNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const userRole = auth?.user?.role?.toLowerCase() || auth?.role?.toLowerCase() || '';
  const isNurse = userRole === 'nurse';
  const isManagement = userRole === 'management' || userRole === 'admin';
  const nurseId = auth?.nurse_id || null;

  // Fetch session notes
  useEffect(() => {
    fetchSessionNotes();
  }, [page, rowsPerPage]);

  const fetchSessionNotes = async () => {
    try {
      setLoading(true);
      
      // Build the query params
      let query = `?page=${page + 1}&limit=${rowsPerPage}`;
      
      // For nurses, only show their own notes
      if (isNurse && nurseId) {
        query += `&nurse=${nurseId}`;
      }
      
      if (searchTerm) {
        query += `&search=${searchTerm}`;
      }
      
      const response = await API.get(`/counseling-results/${query}`);
      
      setSessionNotes(response.data || []);
      setTotalCount(response.data.length || 0);
    } catch (error) {
      console.error('Error fetching session notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchSessionNotes();
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Filter the data - this handles client-side filtering when typing in the search box
  const filteredNotes = sessionNotes.filter(note => {
    if (!searchTerm) return true;
    
    // Search in nurse name, counseling title, or feedback
    const nurseNameMatch = note.nurse?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const counselingTitleMatch = note.consultation?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const feedbackMatch = note.nurse_feedback?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return nurseNameMatch || counselingTitleMatch || feedbackMatch;
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNurse ? "My Session Notes" : "All Session Notes"}
        </Typography>
        
        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder={isNurse ? "Search in my notes..." : "Search by session, nurse, or content..."}
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
        
        {/* Results Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader aria-label="session notes table">
              <TableHead>
                <TableRow>
                  <TableCell>Counseling Session</TableCell>
                  {isManagement && <TableCell>Nurse</TableCell>} {/* Only show Nurse column for management */}
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Feedback Preview</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isManagement ? 6 : 5} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isManagement ? 6 : 5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No session notes found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotes.map((note) => (
                    <TableRow key={note.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <NotesIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {note.consultation?.title || 'Unknown Session'}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* Only show Nurse column for management */}
                      {isManagement && (
                        <TableCell>
                          <Chip
                            label={note.nurse?.name || 'Unknown Nurse'}
                            size="small"
                            variant="outlined"
                            icon={<PersonIcon />}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        {dayjs(note.created_at).format('DD MMM YYYY, HH:mm')}
                      </TableCell>
                      <TableCell>
                        {dayjs(note.updated_at).format('DD MMM YYYY, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 300, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                          }}
                        >
                          {note.nurse_feedback || 'No feedback provided'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleViewNote(note)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
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

export default SessionNotesPage;