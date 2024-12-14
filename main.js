const express = require("express");

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

// Start servers
const server8080 = app8080.listen(8080, () => {
  console.log("Server running on port 8080");
});

const server8000 = app8000.listen(8000, () => {
  console.log("Server running on port 8000");
});

const server9000 = app9000.listen(9000, () => {
  console.log("Server running on port 9000");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  [server8080, server8000, server9000].forEach((server) => server.close());
});
