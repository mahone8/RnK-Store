// R&K E-commerce API Server — local/Node-host entrypoint.
// On Vercel the same app runs as a serverless function (see api/index.js).
// Developer: levelose.tech
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`R&K API server running on port ${PORT}`);
  console.log('Developer: levelose.tech');
});
