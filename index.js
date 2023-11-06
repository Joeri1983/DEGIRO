const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Define an API route that accepts JSON payload at /input
app.post('/input', (req, res) => {
  const payload = req.body;

  // Check if "waarde" exists in the JSON payload
  if (payload && payload.waarde) {
    const waardeValue = payload.waarde;
    res.status(200).json({ message: `Received "waarde" with value: ${waardeValue}` });
  } else {
    res.status(400).json({ error: 'Invalid JSON payload. "waarde" is missing.' });
  }
});

// Define a route for a GET request to generate a random number
app.get('/random', (req, res) => {
  const randomValue = Math.floor(Math.random() * 100) + 1;
  res.status(200).json({ value: randomValue });
});

app.listen(port, () => {
  console.log(`Node.js API is running on port ${port}`);
});
