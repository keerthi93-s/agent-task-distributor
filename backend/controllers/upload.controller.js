const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/agent.model');
const ListItem = require('../models/listItem.model');

// Process uploaded file and distribute entries
const processFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the uploaded file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate file structure
    const requiredFields = ['FirstName', 'Phone', 'Notes'];
    const firstRow = data[0];
    const hasRequiredFields = requiredFields.every(field => field in firstRow);

    if (!hasRequiredFields) {
      return res.status(400).json({
        message: 'Invalid file structure. Required fields: FirstName, Phone, Notes',
      });
    }

    // Get all agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents available' });
    }

    // Distribute entries among agents
    const entries = [];
    let agentIndex = 0;

    for (const row of data) {
      const entry = new ListItem({
        firstName: row.FirstName,
        phone: row.Phone,
        notes: row.Notes,
        assignedAgent: agents[agentIndex]._id,
      });

      await entry.save();
      entries.push(entry);

      // Update agent's assigned entries
      await Agent.findByIdAndUpdate(agents[agentIndex]._id, {
        $push: { assignedEntries: entry._id },
      });

      // Rotate through agents
      agentIndex = (agentIndex + 1) % agents.length;
    }

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'File processed successfully',
      entriesCount: entries.length,
    });
  } catch (error) {
    console.error('File processing error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get all entries
const getEntries = async (req, res) => {
  try {
    const entries = await ListItem.find()
      .populate('assignedAgent', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get entries by agent
const getEntriesByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const entries = await ListItem.find({ assignedAgent: agentId })
      .populate('assignedAgent', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Get entries by agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  processFile,
  getEntries,
  getEntriesByAgent,
}; 