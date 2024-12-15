import express from "express";

import {
  getSystemMetrics,
  getV8Metrics,
  getProcessMetrics,
} from "./metrics.js";


// Create three separate Express apps
const app8080 = express();
const app8000 = express();
const app9000 = express();

// Middleware to log requests
const logRequest = (appName) => (req, res, next) => {
  console.log(`Request received on ${appName}`);
  next();
};

// Configure each app with a different response
app8080.use(logRequest("8080"));
app8000.use(logRequest("8000"));
app9000.use(logRequest("9000"));

// Routes for each app
app8080.get("/", (req, res) => {
  res.json({
    message: "Hello from port 8080!",
    endpoints: ["/health", "/version"],
  });
});

app8000.get("/", (req, res) => {
  res.json({
    message: "Hello from port 8000!",
    services: ["metrics", "monitoring"],
  });
});

app8000.get("/metrics", (req, res) => {
  try {
    const metrics = {
      ...getSystemMetrics(),
      ...getV8Metrics(),
      ...getProcessMetrics(),
      timestamp: new Date().toISOString(),
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve metrics",
      details: error.message,
    });
  }
});

app9000.get("/", (req, res) => {
  res.json({
    message: "Hello from port 9000!",
    admin: ["config", "system-info"],
  });
});

// Health check endpoints
app8080.get("/health", (req, res) =>
  res.status(200).json({ status: "healthy" })
);
app8000.get("/health", (req, res) =>
  res.status(200).json({ status: "operational" })
);
app9000.get("/health", (req, res) =>
  res.status(200).json({ status: "running" })
);

// Version endpoints
app8080.get("/version", (req, res) => res.json({ version: "0.1.0" }));

// Start servers (using async/await for cleaner shutdown)
const startServer = async (app, port) => {
  try {
    const server = await new Promise((resolve, reject) => {
      const s = app.listen(port, () => resolve(s));
      s.on("error", reject);
    });
    console.log(`Server running on port ${port}`);
    return server;
  } catch (error) {
    console.error(`Error starting server on port ${port}:`, error);
    process.exit(1); // Exit the process if a server fails to start
  }
};

async function main() {
  const server8080 = await startServer(app8080, 8080);
  const server8000 = await startServer(app8000, 8000);
  const server9000 = await startServer(app9000, 9000);

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully");
    [server8080, server8000, server9000].forEach((server) => server.close());
  });
}

main();
