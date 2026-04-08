import express from 'express';
import cors from 'cors';
import { taskQueue } from './queue/taskQueue.js';
import { workerManager } from './worker/workerManager.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize worker manager
workerManager.start();

// API Endpoints
app.get('/api/jobs', (req, res) => {
  res.json(taskQueue.getAllJobs());
});

app.post('/api/jobs', (req, res) => {
  const { count = 1 } = req.body;
  const batchId = `batch-${Date.now()}`;
  const newJobs = taskQueue.addJobs(batchId, count);
  
  // Signal worker manager to check for new pending jobs
  workerManager.processNext();
  
  res.status(202).json({ batchId, count: newJobs.length });
});

app.delete('/api/jobs', (req, res) => {
  taskQueue.clearFinished();
  res.status(204).end();
});

// SSE Endpoint
app.get('/api/jobs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = () => {
    res.write(`data: ${JSON.stringify(taskQueue.getAllJobs())}\n\n`);
  };

  // Initial send
  sendUpdate();

  // Listen for changes
  taskQueue.on('change', sendUpdate);

  // Clean up on disconnect
  req.on('close', () => {
    taskQueue.off('change', sendUpdate);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
