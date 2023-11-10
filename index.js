const http = require('http');
const https = require('https');
const fs = require('fs');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let recordsToShow = 25; // Default number of records to show
    if (req.url.includes('/show')) {
      const requestedRecords = req.url.split('/show')[1];
      if (requestedRecords === '25' || requestedRecords === '50' || requestedRecords === '100' || requestedRecords === '250') {
        recordsToShow = parseInt(requestedRecords);
      }
    }

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

        const latestValues = values.slice(-recordsToShow); // Select the latest records

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');

        // Buttons to choose the number of records to display
        res.write(`<button onclick="window.location.href='/show25'">Show 25 records</button>`);
        res.write(`<button onclick="window.location.href='/show50'">Show 50 records</button>`);
        res.write(`<button onclick="window.location.href='/show100'">Show 100 records</button>`);
        res.write(`<button onclick="window.location.href='/show250'">Show 250 records</button>`);

        // Create a canvas for the chart
        res.write('<canvas id="myChart" width="400" height="200"></canvas>');

        // Generate the chart using Chart.js
        res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        res.write('<script>');
        res.write('var ctx = document.getElementById("myChart").getContext("2d");');
        res.write('var labels = ' + JSON.stringify(latestValues.map((line) => line.date)) + ';');
        res.write('var data = ' + JSON.stringify(latestValues.map((line) => line.value)) + ';');
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

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
