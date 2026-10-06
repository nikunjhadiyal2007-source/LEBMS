// server.js: Express Application Entry Point
const express = require('express');
const session = require('express-session');
const path = require('path');
const env = require('./config/env');
const { connectMongo } = require('./config/db.mongo');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// 1. Core Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Session Middleware
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

// Ensure Mongo is connected for API requests
app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (e) {
    console.error('[MongoDB Middleware Error]:', e.message);
    next();
  }
});

// 3. Root redirect based on session auth
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/index.html');
  }
  return res.redirect('/login.html');
});

// 4. Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 4. API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/departments', require('./routes/departments.routes'));

// Conditionally require other routes if they exist
const routeModules = [
  ['/api/labs', './routes/labs.routes'],
  ['/api/categories', './routes/categories.routes'],
  ['/api/equipment', './routes/equipment.routes'],
  ['/api/bookings', './routes/bookings.routes'],
  ['/api/issues', './routes/issues.routes'],
  ['/api/returns', './routes/returns.routes'],
  ['/api/maintenance', './routes/maintenance.routes'],
  ['/api/damage', './routes/damage.routes'],
  ['/api/notifications', './routes/notifications.routes'],
  ['/api/dashboard', './routes/dashboard.routes'],
  ['/api/mining', './routes/mining.routes'],
  ['/api/reports', './routes/reports.routes'],
  ['/api/xml', './routes/xml.routes'],
  ['/api/logs', './routes/logs.routes'],
  ['/api/showcase', './routes/showcase.routes']
];

for (const [routePath, modPath] of routeModules) {
  try {
    app.use(routePath, require(modPath));
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.warn(`[Route Loader Warning] Failed loading ${modPath}:`, e.message);
    }
  }
}

// 5. 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// 6. Central Error Handler
app.use(errorHandler);

// Listen only when run directly (so tests can import app)
if (require.main === module) {
  const pool = require('./config/db.mysql');
  Promise.all([
    connectMongo(),
    pool.query('SELECT 1 AS ok')
  ])
    .then(() => {
      app.listen(env.port, () => {
        console.log(`====================================================`);
        console.log(` LEBMS Server listening on http://localhost:${env.port}`);
        console.log(` MySQL Pool: Connected (${env.mysql.host}:${env.mysql.port})`);
        console.log(` MongoDB: Connected (${env.mongo.uri})`);
        console.log(` Environment: Node ${process.version}`);
        console.log(`====================================================`);
      });
    })
    .catch(err => {
      console.error('[Server Init Error]:', err);
    });
}

module.exports = app;
