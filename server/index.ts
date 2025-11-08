import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { initDatabase } from "./db";
import path from "path";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  // Initialize database first
  await initDatabase();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Error:', err);
    res.status(status).json({ message });
  });

  // Serve static files for now
  app.use(express.static('public'));
  
  // Simple catch-all for non-API routes
  app.get('/', (_req, res) => {
    res.json({ 
      message: 'CampusFrames API is running!',
      endpoints: [
        'GET /api/surveys - Get surveys',
        'POST /api/surveys - Create survey',
        'GET /api/stories - Get stories', 
        'POST /api/stories - Create story',
        'GET /api/alerts - Get alerts'
      ]
    });
  });

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, '127.0.0.1', () => {
    console.log(`🚀 CampusFrames server running at http://localhost:${port}`);
    console.log(`📊 Using SQLite database for development`);
    console.log(`🤖 AI features running in mock mode (no OpenAI key)`);
  });
})();
