import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { getAgents, getEntries, getEntriesByAgent } from '../services/api';
import { toast } from 'react-toastify';

const ListView = () => {
  const [entries, setEntries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [selectedAgent]);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch agents');
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = selectedAgent === 'all'
        ? await getEntries()
        : await getEntriesByAgent(selectedAgent);
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">List View</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Agent</InputLabel>
          <Select
            value={selectedAgent}
            label="Filter by Agent"
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <MenuItem value="all">All Agents</MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent._id} value={agent._id}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Assigned Agent</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>{entry.firstName}</TableCell>
                <TableCell>{entry.phone}</TableCell>
                <TableCell>{entry.notes}</TableCell>
                <TableCell>
                  {entry.assignedAgent?.name || 'Unassigned'}
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color:
                        entry.status === 'completed'
                          ? 'success.main'
                          : entry.status === 'in-progress'
                          ? 'warning.main'
                          : 'text.secondary',
                    }}
                  >
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListView; 