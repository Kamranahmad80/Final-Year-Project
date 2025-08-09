import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, 
  TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Box, 
  AppBar, Toolbar, IconButton, Snackbar, Alert,
  CircularProgress, Tabs, Tab, Select, MenuItem, Chip,
  TextField, InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Pagination, Checkbox
} from "@mui/material";
import { 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Jobs table state (server-side pagination)
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsRowsPerPage, setJobsRowsPerPage] = useState(10);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [jobsSearch, setJobsSearch] = useState('');
  const [jobsSelected, setJobsSelected] = useState([]);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Job form (create/edit)
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [jobFormMode, setJobFormMode] = useState('create'); // 'create' | 'edit'
  const [jobFormSubmitting, setJobFormSubmitting] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    _id: undefined,
    title: '',
    company: '',
    description: '',
    location: '',
    category: '',
    jobType: '',
    salary: '',
    salaryDisplay: '',
    status: 'active',
    skills: '' // comma separated in UI
  });

  // Users table state (client-side filters/pagination)
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('all');
  const [usersStatusFilter, setUsersStatusFilter] = useState('all');
  const [usersPage, setUsersPage] = useState(0);
  const [usersRowsPerPage, setUsersRowsPerPage] = useState(10);

  // Delete user confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);

  // Delete job confirmation dialog state
  const [deleteJobConfirmOpen, setDeleteJobConfirmOpen] = useState(false);
  const [deleteTargetJob, setDeleteTargetJob] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/admin');
        return;
      }

      const [jobsRes, usersRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/jobs", {
          headers: { "x-auth-token": token },
          params: {
            page: jobsPage,
            limit: jobsRowsPerPage,
            search: jobsSearch
          }
        }),
        axios.get("http://localhost:5000/api/admin/users", {
          headers: { "x-auth-token": token }
        }),
        axios.get("http://localhost:5000/api/admin/stats", {
          headers: { "x-auth-token": token }
        })
      ]);
      
      // Update state with the correct data structure from the API responses
      setJobs(jobsRes.data.data?.jobs || []);
      setJobsTotalPages(jobsRes.data.data?.totalPages || 1);
      setUsers(usersRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || 'Failed to fetch data');
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('[AdminDashboard] handleDeleteUser confirmed for userId:', userId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[AdminDashboard] No token found in localStorage');
      }
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { 'x-auth-token': token }
      });
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete user', severity: 'error' });
    }
  };

  const openDeleteUserConfirm = (user) => {
    console.log('[AdminDashboard] openDeleteUserConfirm for userId:', user._id);
    setDeleteTargetUser(user);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteUserConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetUser(null);
  };

  const confirmDeleteUser = async () => {
    if (!deleteTargetUser?._id) return closeDeleteUserConfirm();
    await handleDeleteUser(deleteTargetUser._id);
    closeDeleteUserConfirm();
  };

  const handleDeleteJob = async (jobId) => {
    console.log('[AdminDashboard] handleDeleteJob confirmed for jobId:', jobId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[AdminDashboard] No token found in localStorage');
      }
      await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`, {
        headers: { 'x-auth-token': token }
      });
      setSnackbar({ open: true, message: 'Job deleted successfully', severity: 'success' });
      fetchData();
    } catch (err) {
      console.error('Error deleting job:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete job', severity: 'error' });
    }
  };

  const openDeleteJobConfirm = (job) => {
    console.log('[AdminDashboard] openDeleteJobConfirm for jobId:', job._id);
    setDeleteTargetJob(job);
    setDeleteJobConfirmOpen(true);
  };

  const closeDeleteJobConfirm = () => {
    setDeleteJobConfirmOpen(false);
    setDeleteTargetJob(null);
  };

  const confirmDeleteJob = async () => {
    if (!deleteTargetJob?._id) return closeDeleteJobConfirm();
    await handleDeleteJob(deleteTargetJob._id);
    closeDeleteJobConfirm();
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        { status: newStatus },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: 'User status updated successfully',
        severity: 'success'
      });
      fetchData();
    } catch (err) {
      console.error('Error updating user status:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update user status',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    // Set active tab based on URL
    const tabFromUrl = location.pathname.split('/').pop();
    if (tabFromUrl === 'dashboard') setActiveTab(0);
    else if (tabFromUrl === 'jobs') setActiveTab(1);
    else if (tabFromUrl === 'users') setActiveTab(2);
    
    fetchData();
  }, [location]);

  // Refetch jobs when server-side query changes
  useEffect(() => {
    fetchData();
  }, [jobsPage, jobsRowsPerPage, jobsSearch]);

  // moved: job deletion is handled via confirm dialog (see handleDeleteJob defined above)

  // Job create/edit dialog helpers
  const openCreateJobDialog = () => {
    setJobFormMode('create');
    setJobFormData({
      _id: undefined,
      title: '',
      company: '',
      description: '',
      location: '',
      category: '',
      jobType: '',
      salary: '',
      salaryDisplay: '',
      status: 'active',
      skills: ''
    });
    setJobFormOpen(true);
  };

  const openEditJobDialog = (job) => {
    setJobFormMode('edit');
    setJobFormData({
      _id: job._id,
      title: job.title || '',
      company: job.company || job.Company || '',
      description: job.description || '',
      location: job.location || job.Location || '',
      category: job.category || job.Category || '',
      jobType: job.jobType || '',
      salary: job.salary || '',
      salaryDisplay: job.salaryDisplay || '',
      status: job.status || 'active',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '')
    });
    setJobFormOpen(true);
  };

  const closeJobFormDialog = () => setJobFormOpen(false);
  const handleJobFormChange = (field) => (e) => {
    setJobFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleJobFormSubmit = async (e) => {
    e.preventDefault();
    setJobFormSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: jobFormData.title,
        description: jobFormData.description,
        company: jobFormData.company,
        location: jobFormData.location,
        category: jobFormData.category,
        jobType: jobFormData.jobType,
        salary: jobFormData.salary,
        salaryDisplay: jobFormData.salaryDisplay,
        status: jobFormData.status,
        skills: jobFormData.skills
          ? jobFormData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : []
      };

      if (jobFormMode === 'create') {
        await axios.post('http://localhost:5000/api/admin/jobs', payload, {
          headers: { 'x-auth-token': token }
        });
        setSnackbar({ open: true, message: 'Job created successfully', severity: 'success' });
      } else {
        await axios.put(`http://localhost:5000/api/admin/jobs/${jobFormData._id}`, payload, {
          headers: { 'x-auth-token': token }
        });
        setSnackbar({ open: true, message: 'Job updated successfully', severity: 'success' });
      }

      setJobFormOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save job failed', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save job', severity: 'error' });
    } finally {
      setJobFormSubmitting(false);
    }
  };

  // Jobs helpers
  const handleJobSearchChange = (e) => {
    setJobsSearch(e.target.value);
    setJobsPage(1);
  };

  const handleJobsPagination = (event, value) => {
    setJobsPage(value);
  };

  const handleSelectAllJobs = (e) => {
    setJobsSelected(e.target.checked ? jobs.map((j) => j._id) : []);
  };

  const handleSelectJob = (id) => {
    setJobsSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteJobs = async () => {
    if (jobsSelected.length === 0) return;
    if (!window.confirm(`Delete ${jobsSelected.length} selected job(s)?`)) return;
    try {
      const token = localStorage.getItem('token');
      for (const id of jobsSelected) {
        // eslint-disable-next-line no-await-in-loop
        await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
          headers: { 'x-auth-token': token }
        });
      }
      setSnackbar({ open: true, message: 'Selected jobs deleted', severity: 'success' });
      setJobsSelected([]);
      fetchData();
    } catch (err) {
      console.error('Bulk delete failed', err);
      setSnackbar({ open: true, message: 'Failed bulk delete', severity: 'error' });
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleCloseJobDetails = () => {
    setJobDetailsOpen(false);
    setSelectedJob(null);
  };

  const exportToCSV = (filename, rows) => {
    if (!rows || rows.length === 0) return;
    const replacer = (key, value) => (value === null || value === undefined ? '' : value);
    const header = Object.keys(rows[0]);
    const csv = [
      header.join(','),
      ...rows.map((row) => header.map((field) => JSON.stringify(row[field], replacer)).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJobs = () => {
    const rows = jobs.map((j) => ({
      title: j.title,
      company: j.company || j.Company,
      status: j.status || 'active',
      createdAt: j.createdAt
    }));
    exportToCSV('jobs.csv', rows);
  };

  const handleExportUsers = (filteredUsers) => {
    const rows = filteredUsers.map((u) => ({
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status || 'active'
    }));
    exportToCSV('users.csv', rows);
  };

  const handleRefresh = () => fetchData();

  // Users helpers
  const handleUsersSearchChange = (e) => setUsersSearch(e.target.value);
  const handleUsersRoleFilter = (e) => setUsersRoleFilter(e.target.value);
  const handleUsersStatusFilter = (e) => setUsersStatusFilter(e.target.value);
  const handleUsersPageChange = (event, newPage) => setUsersPage(newPage);
  const handleUsersRowsPerPageChange = (event) => {
    setUsersRowsPerPage(parseInt(event.target.value, 10));
    setUsersPage(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box my={4} textAlign="center">
          <Typography color="error">{error}</Typography>
          <Button onClick={fetchData} variant="outlined" sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      );
    }

    switch (activeTab) {
      case 0: // Dashboard
        return (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>Dashboard Overview</Typography>
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3
              }}
            >
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" color="text.secondary">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers || 0}</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" color="text.secondary">Total Jobs</Typography>
                <Typography variant="h4">{stats.totalJobs || 0}</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" color="text.secondary">Active Jobs</Typography>
                <Typography variant="h4">{stats.activeJobs || 0}</Typography>
              </Paper>
            </Box>
          </Box>
        );
      
      case 1: // Jobs
        return (
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Manage Jobs</Typography>
              <Box>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export CSV">
                  <IconButton onClick={handleExportJobs} sx={{ mr: 1 }}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Create job">
                  <Button variant="contained" color="primary" onClick={openCreateJobDialog}>
                    Add New Job
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Box mb={2}>
              <TextField
                placeholder="Search jobs by title..."
                value={jobsSearch}
                onChange={handleJobSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={jobsSelected.length > 0 && jobsSelected.length < jobs.length}
                        checked={jobs.length > 0 && jobsSelected.length === jobs.length}
                        onChange={handleSelectAllJobs}
                      />
                    </TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <TableRow key={job._id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={jobsSelected.includes(job._id)}
                            onChange={() => handleSelectJob(job._id)}
                          />
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company || job.Company}</TableCell>
                        <TableCell>
                          <Chip 
                            label={job.status || 'active'} 
                            color={job.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View details">
                            <IconButton onClick={() => handleViewJob(job)} sx={{ mr: 1 }}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit job">
                            <IconButton onClick={() => openEditJobDialog(job)} sx={{ mr: 1 }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete job">
                            <IconButton
                              aria-label="delete-job"
                              onClick={(e) => { e.stopPropagation(); openDeleteJobConfirm(job); }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              <Button
                variant="outlined"
                color="error"
                disabled={jobsSelected.length === 0}
                onClick={handleBulkDeleteJobs}
              >
                Delete Selected ({jobsSelected.length})
              </Button>

              <Box display="flex" alignItems="center">
                <Select
                  size="small"
                  value={jobsRowsPerPage}
                  onChange={(e) => setJobsRowsPerPage(parseInt(e.target.value, 10))}
                  sx={{ mr: 2 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
                <Pagination
                  color="primary"
                  count={jobsTotalPages}
                  page={jobsPage}
                  onChange={handleJobsPagination}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Box>
          </Box>
        );
      
      case 2: // Users
        // Compute filtered and paginated users
        const filteredUsers = users
          .filter((u) =>
            usersSearch
              ? (u.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                 u.email?.toLowerCase().includes(usersSearch.toLowerCase()))
              : true
          )
          .filter((u) => (usersRoleFilter === 'all' ? true : u.role === usersRoleFilter))
          .filter((u) => (usersStatusFilter === 'all' ? true : (u.status || 'active') === usersStatusFilter));
        const usersCount = filteredUsers.length;
        const pagedUsers = filteredUsers.slice(
          usersPage * usersRowsPerPage,
          usersPage * usersRowsPerPage + usersRowsPerPage
        );
        return (
          <Box mt={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5">Manage Users</Typography>
              <Box>
                <Tooltip title="Export CSV">
                  <IconButton onClick={() => handleExportUsers(filteredUsers)}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box display="flex" gap={2} mb={2}>
              <TextField
                placeholder="Search by name or email..."
                value={usersSearch}
                onChange={handleUsersSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ maxWidth: 320 }}
              />
              <Select size="small" value={usersRoleFilter} onChange={handleUsersRoleFilter}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              <Select size="small" value={usersStatusFilter} onChange={handleUsersStatusFilter}>
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="banned">Banned</MenuItem>
              </Select>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedUsers.length > 0 ? (
                    pagedUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Select
                            value={user.status || 'active'}
                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                            size="small"
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="suspended">Suspended</MenuItem>
                            <MenuItem value="banned">Banned</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={user.role === 'admin' ? 'Admins cannot be deleted' : 'Delete user'}>
                            <span>
                              <IconButton
                                aria-label="delete-user"
                                disabled={user.role === 'admin'}
                                onClick={(e) => { e.stopPropagation(); openDeleteUserConfirm(user); }}
                              >
                                <DeleteIcon color={user.role === 'admin' ? 'disabled' : 'error'} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end">
              <TableContainer>
                <Box>
                  <Box>
                    <Box>
                      {/* Pagination controls */}
                      <Box display="flex" justifyContent="flex-end" py={2}>
                        <Select
                          size="small"
                          value={usersRowsPerPage}
                          onChange={handleUsersRowsPerPageChange}
                          sx={{ mr: 2 }}
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                        </Select>
                        <Pagination
                          color="primary"
                          count={Math.max(1, Math.ceil(usersCount / usersRowsPerPage))}
                          page={usersPage + 1}
                          onChange={(e, page) => handleUsersPageChange(e, page - 1)}
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </TableContainer>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <WorkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Job Portal Admin
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200, bgcolor: '#f5f5f5' }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<WorkIcon />} label="Jobs" />
          <Tab icon={<PersonIcon />} label="Users" />
        </Tabs>
        
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
          <Container maxWidth="lg" sx={{ py: 2 }}>
            {renderTabContent()}
          </Container>
        </Box>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    {/* Job Details Dialog */}
    <Dialog open={jobDetailsOpen} onClose={handleCloseJobDetails} maxWidth="md" fullWidth>
      <DialogTitle>Job Details</DialogTitle>
      <DialogContent dividers>
        {selectedJob ? (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                <Typography variant="body1">{selectedJob.title || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                <Typography variant="body1">{selectedJob.company || selectedJob.Company || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{selectedJob.location || selectedJob.Location || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1">{selectedJob.category || selectedJob.Category || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip label={selectedJob.status || 'active'} size="small" color={(selectedJob.status || 'active') === 'active' ? 'success' : 'default'} />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedJob.description || 'No description'}
                </Typography>
              </Box>
            </Box>
            <Box mt={2}>
              <Button onClick={() => { setJobDetailsOpen(false); openEditJobDialog(selectedJob); }}>Edit</Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseJobDetails}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Job Create/Edit Dialog */}
    <Dialog open={jobFormOpen} onClose={closeJobFormDialog} maxWidth="md" fullWidth>
      <DialogTitle>{jobFormMode === 'create' ? 'Create Job' : 'Edit Job'}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleJobFormSubmit} sx={{ mt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Title" value={jobFormData.title} onChange={handleJobFormChange('title')} required fullWidth />
            <TextField label="Company" value={jobFormData.company} onChange={handleJobFormChange('company')} required fullWidth />
            <TextField label="Location" value={jobFormData.location} onChange={handleJobFormChange('location')} fullWidth />
            <TextField label="Category" value={jobFormData.category} onChange={handleJobFormChange('category')} fullWidth />
            <TextField label="Job Type" value={jobFormData.jobType} onChange={handleJobFormChange('jobType')} fullWidth />
            <TextField label="Salary" value={jobFormData.salary} onChange={handleJobFormChange('salary')} fullWidth />
            <TextField label="Salary Display" value={jobFormData.salaryDisplay} onChange={handleJobFormChange('salaryDisplay')} fullWidth />
            <Box>
              <Select value={jobFormData.status} onChange={handleJobFormChange('status')} fullWidth size="small">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField label="Skills (comma separated)" value={jobFormData.skills} onChange={handleJobFormChange('skills')} fullWidth />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField label="Description" value={jobFormData.description} onChange={handleJobFormChange('description')} fullWidth multiline minRows={3} />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeJobFormDialog} disabled={jobFormSubmitting}>Cancel</Button>
        <Button onClick={handleJobFormSubmit} variant="contained" disabled={jobFormSubmitting}>
          {jobFormMode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Delete User Confirmation Dialog */}
    <Dialog open={deleteConfirmOpen} onClose={closeDeleteUserConfirm} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete{' '}
          <strong>{deleteTargetUser?.email || deleteTargetUser?.name || 'this user'}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteUserConfirm}>Cancel</Button>
        <Button color="error" variant="contained" onClick={confirmDeleteUser}>Delete</Button>
      </DialogActions>
    </Dialog>

    {/* Delete Job Confirmation Dialog */}
    <Dialog open={deleteJobConfirmOpen} onClose={closeDeleteJobConfirm} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Job</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete{' '}
          <strong>{deleteTargetJob?.title || 'this job'}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteJobConfirm}>Cancel</Button>
        <Button color="error" variant="contained" onClick={confirmDeleteJob}>Delete</Button>
      </DialogActions>
    </Dialog>

    </>
  );
};

export default AdminDashboard;