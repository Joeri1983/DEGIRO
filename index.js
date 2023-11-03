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
        const lines = data.trim().split(',');
        const values = lines.map((line) => {
          const [date, value] = line.split(':');
          return {
            date: date,
            value: parseFloat(value), // Convert value to a floating-point number
          };
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');

        // Add an input for selecting values
        res.write('<select id="valueSelector">');
        values.forEach((line, index) => {
          res.write(`<option value="${index}">${line.date}</option>`);
        });
        res.write('</select>');

        // Add a button to calculate and update the chart
        res.write('<button onclick="calculatePercentageDifference()">Calculate</button>');

        // Create a canvas for the chart
        res.write('<canvas id="myChart" width="400" height="200"></canvas>');

        // Generate the chart using Chart.js
        res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
        res.write('<script>');
        res.write('var ctx = document.getElementById("myChart").getContext("2d");');
        res.write('var chartData = ' + JSON.stringify(values.map((line) => line.value)) + ';');
        res.write('var chart = new Chart(ctx, {');
        res.write('type: "line",');
        res.write('data: {');
        res.write('labels: ' + JSON.stringify(values.map((line) => line.date)) + ',');
        res.write('datasets: [{');
        res.write('label: "Values",');
        res.write('data: chartData,');
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

        // JavaScript function to calculate and update percentage difference
        res.write('function calculatePercentageDifference() {');
        res.write('var select = document.getElementById("valueSelector");');
        res.write('var selectedIndex = select.value;');
        res.write('var selectedValue = chartData[selectedIndex];');
        res.write('var percentageDifference = ((selectedValue - chartData[0]) / chartData[0]) * 100;');
        res.write('document.getElementById("percentageDifference").innerText = "Percentage Difference: " + percentageDifference.toFixed(2) + "%";');
        res.write('}');
        res.write('</script>');

        // Display the percentage difference
        res.write('<div id="percentageDifference"></div>');

        res.write('</body></html>');
        res.end();
      });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
