const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  processFile,
  getEntries,
  getEntriesByAgent,
} = require('../controllers/upload.controller');

router.use(auth);

router.post('/', upload.single('file'), processFile);
router.get('/entries', getEntries);
router.get('/entries/agent/:agentId', getEntriesByAgent);

module.exports = router; 