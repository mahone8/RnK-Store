// R&K E-commerce API Server — local/Node-host entrypoint.
// The app itself lives in src/app.js, shared with the Vercel serverless
// function (api/index.js). Keep all middleware/routes there, not here.
// Developer: levelose.tech
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`R&K API server running on port ${PORT}`);
  console.log('Developer: levelose.tech');
});
