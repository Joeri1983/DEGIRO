const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080; // Change the port to 8080

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Create an API route that accepts JSON payloads at /waarde
app.post('/waarde', (req, res) => {
  const payload = req.body;

  // Check if "waarde" exists in the JSON payload
  if (payload && payload.waarde) {
    const waardeValue = payload.waarde;
    res.status(200).json({ message: `Received "waarde" with value: ${waardeValue}` });
  } else {
    res.status(400).json({ error: 'Invalid JSON payload. "waarde" is missing.' });
  }
});

// Create your server with the existing code
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Fetch and display the contents of waardes.csv
    https.get(azureStorageUrl, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const lines = data.trim().split(',');
        const values = lines.map((line) => {
          const [date, value] = line.split(':');
          return {
            date: date,
            value: value,
          };
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');

        // Create a canvas for the chart
        res.write('<canvas id="myChart" width="400" height="200"></canvas>');

        // Generate the chart using Chart.js
        res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        res.write('<script>');
        res.write('var ctx = document.getElementById("myChart").getContext("2d");');
        res.write('var labels = ' + JSON.stringify(values.map((line) => line.date)) + ';');
        res.write('var data = ' + JSON.stringify(values.map((line) => line.value)) + ';');
        res.write('var myChart = new Chart(ctx, {');
        res.write('type: "line",');
        res.write('data: {');
        res.write('labels: labels,');
        res.write('datasets: [{');
        res.write('label: "Values",');
        res.write('data: data,');
        res.write('backgroundColor: "rgba(75, 192, 192, 0.2)",');
        res.write('borderColor: "rgba(75, 192, 192, 1)",');
        res.write('borderWidth: 1');
        res.write('}]');
        res.write('},');
        res.write('options: {');
        res.write('scales: {');
        res.write('y: {');
        res.write('beginAtZero: true');
        res.write('}');
        res.write('}');
        res.write('}');
        res.write('});');
        res.write('</script>');

        res.write('</body></html>');
        res.end();
      });
    });
  }
});

// Add the Express app to your server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
