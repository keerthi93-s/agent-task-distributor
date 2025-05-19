const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require('../controllers/agent.controller');

router.use(auth);

router.get('/', getAgents);
router.post('/', createAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router; 