// Vercel serverless entrypoint — serves the whole R&K Express app at /api/*.
// Routing is configured in the root vercel.json.
const app = require('../server/src/app');

module.exports = app;
