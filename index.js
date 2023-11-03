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
        res.write('},');
        res.write('plugins: {');
        res.write('tooltip: {');
        res.write('callbacks: {');
        res.write('title: function(context) {');
        res.write('return context[0].label;');
        res.write('},');
        res.write('label: function(context) {');
        res.write('var selectedIndex = document.getElementById("valueSelector").value;');
        res.write('var selectedValue = chartData[selectedIndex];');
        res.write('var percentageDifference = ((context.parsed.y - selectedValue) / selectedValue) * 100;');
        res.write('return "Percentage Difference: " + percentageDifference.toFixed(2) + "%";');
        res.write('},');
        res.write('},');
        res.write('},');
        res.write('},');
        res.write('});');

        // Add a change event listener for the valueSelector dropdown
        res.write('document.getElementById("valueSelector").addEventListener("change", function () {');
        res.write('var selectedIndex = this.value;');
        res.write('var selectedValue = chartData[selectedIndex];');
        res.write('var tooltip = chart.getPlugin("tooltip");');
        res.write('tooltip.options.callbacks.label = function(context) {');
        res.write('var percentageDifference = ((context.parsed.y - selectedValue) / selectedValue) * 100;');
        res.write('return "Percentage Difference: " + percentageDifference.toFixed(2) + "%";');
        res.write('};');
        res.write('chart.update();');
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
