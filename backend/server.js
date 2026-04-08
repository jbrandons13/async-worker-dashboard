import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { taskQueue } from './queue/taskQueue.js';
import { workerManager } from './worker/workerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files from the React app build in production
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  // Allow API and SSE routes to pass through
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
