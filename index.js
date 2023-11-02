const http = require('http');
const https = require('https');
const fs = require('fs');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Fetch and display the contents of waardes.csv
    https.get(azureStorageUrl, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const lines = data.trim().split('\n');
        const sortedLines = lines
          .map((line) => {
            const columns = line.split(';');
            return {
              date: columns[0],
              value: columns[1],
            };
          })
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 3);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');
        res.write('<p>Latest 3 values from waardes.csv sorted by date:</p>');

        res.write('<ul>');
        sortedLines.forEach((line) => {
          res.write(`<li>Date: ${line.date}, Value: ${line.value}</li>`);
        });
        res.write('</ul>');

        // Create a canvas for the chart
        res.write('<canvas id="myChart" width="400" height="200"></canvas>');

        // Generate the chart using Chart.js
        res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        res.write('<script>');
        res.write('var ctx = document.getElementById("myChart").getContext("2d");');
        res.write('var labels = ' + JSON.stringify(sortedLines.map((line) => line.date)) + ';');
        res.write('var values = ' + JSON.stringify(sortedLines.map((line) => line.value)) + ';');
        res.write('var myChart = new Chart(ctx, {');
        res.write('type: "line",');
        res.write('data: {');
        res.write('labels: labels,');
        res.write('datasets: [{');
        res.write('label: "Values",');
        res.write('data: values,');
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
