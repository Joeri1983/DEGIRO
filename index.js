const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Define an API route that accepts JSON payload
app.post('/your-api-endpoint', (req, res) => {
  const payload = req.body;

  // Check if "waarde" exists in the JSON payload
  if (payload && payload.waarde) {
    const waardeValue = payload.waarde;
    res.status(200).json({ message: `Received "waarde" with value: ${waardeValue}` });
  } else {
    res.status(400).json({ error: 'Invalid JSON payload. "waarde" is missing.' });
  }
});

app.listen(port, () => {
  console.log(`Node.js API is running on port ${port}`);
});
