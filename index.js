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
        const values = lines.map((line) => {
          const columns = line.split(';');
          return {
            date: columns[0],
            value: columns[1],
          };
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');

        // Add an input bar at the top of the webpage
        res.write('<input type="text" id="searchInput" placeholder="Enter a value" oninput="searchValue()">');
        
        res.write('<p>Graph:</p>');

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
        res.write('function searchValue() {');
        res.write('var input, filter, ul, li, a, i, txtValue;');
        res.write('input = document.getElementById("searchInput");');
        res.write('filter = input.value;');
        res.write('ul = document.getElementById("myChart");');
        res.write('li = ul.getElementsByTagName("li");');
        res.write('for (i = 0; i < li.length; i++) {');
        res.write('a = li[i].getElementsByTagName("a")[0];');
        res.write('txtValue = a.textContent || a.innerText;');
        res.write('if (txtValue.indexOf(filter) > -1) {');
        res.write('li[i].style.display = "";');
        res.write('} else {');
        res.write('li[i].style.display = "none";');
        res.write('}');
        res.write('}');
        res.write('}');
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
