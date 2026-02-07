const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files (index.html, style.css, app.js)
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
  console.log(`MATHEMATH game running at http://localhost:${PORT}`);
});
