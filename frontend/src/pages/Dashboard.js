import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Person as PersonIcon,
  List as ListIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getAgents, getEntries } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer
} from 'recharts';

// Animated Counter
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let incrementTime = 20;
    let step = Math.ceil(end / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
};

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Fade in timeout={700}>
    <Paper
      elevation={6}
      sx={{
        p: 5,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: color,
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.15)',
        transition: 'transform 0.25s, box-shadow 0.25s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-10px) scale(1.06)',
          boxShadow: '0 16px 48px 0 rgba(25, 118, 210, 0.22)',
        } : {},
      }}
      onClick={onClick}
    >
      <Box sx={{
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.13)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 44 } })}
      </Box>
      <Typography variant="h3" sx={{ mt: 1, fontWeight: 800, letterSpacing: 1 }}>
        <AnimatedCounter value={value} />
      </Typography>
      <Typography variant="h6" sx={{ mt: 1, fontWeight: 500, letterSpacing: 1 }}>{title}</Typography>
    </Paper>
  </Fade>
);

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalEntries: 0,
    completedEntries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [entries, setEntries] = useState([]);
  const [modal, setModal] = useState(null); // 'agents' | 'charts' | null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agentsResponse, entriesResponse] = await Promise.all([
          getAgents(),
          getEntries(),
        ]);

        const completedEntries = entriesResponse.data.filter(
          (entry) => entry.status === 'completed'
        ).length;

        setStats({
          totalAgents: agentsResponse.data.length,
          totalEntries: entriesResponse.data.length,
          completedEntries,
        });
        setAgents(agentsResponse.data);
        setEntries(entriesResponse.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart Data Preparation
  const statusData = [
    { name: 'Completed', value: entries.filter(e => e.status === 'completed').length },
    { name: 'In Progress', value: entries.filter(e => e.status === 'in-progress').length },
    { name: 'Pending', value: entries.filter(e => e.status === 'pending').length },
  ];

  const entriesPerAgent = agents.map(agent => ({
    name: agent.name,
    value: entries.filter(e => e.assignedAgent && e.assignedAgent._id === agent._id).length
  }));

  // Line chart: completed entries over time
  const completedEntriesByDate = {};
  entries.forEach(e => {
    if (e.status === 'completed') {
      const date = new Date(e.updatedAt).toLocaleDateString();
      completedEntriesByDate[date] = (completedEntriesByDate[date] || 0) + 1;
    }
  });
  const lineData = Object.entries(completedEntriesByDate).map(([date, value]) => ({ date, value }));

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      icon: <PersonIcon />,
      color: 'primary.main',
      onClick: () => setModal('agents'),
    },
    {
      title: 'Total Entries',
      value: stats.totalEntries,
      icon: <ListIcon />,
      color: 'success.main',
    },
    {
      title: 'Completed Entries',
      value: stats.completedEntries,
      icon: <CheckCircleIcon />,
      color: 'warning.main',
      onClick: () => setModal('charts'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4, letterSpacing: 1 }}>
        Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title} display="flex">
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Agents Modal */}
      <Dialog open={modal === 'agents'} onClose={() => setModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Agents
          <IconButton
            aria-label="close"
            onClick={() => setModal(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Charts Modal */}
      <Dialog open={modal === 'charts'} onClose={() => setModal(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Completed Entries - Analytics
          <IconButton
            aria-label="close"
            onClick={() => setModal(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 350, mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ height: 350, mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Entries Per Agent
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entriesPerAgent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ height: 350 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Completed Entries Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2e7d32" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 