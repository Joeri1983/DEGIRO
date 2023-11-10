const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
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

        let startIndex = Math.max(0, values.length - 50); // Start index for the initial display
        let endIndex = Math.min(values.length, startIndex + 50); // End index for the initial display

        function sendValues(start, end) {
          const slicedValues = values.slice(start, end);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.write('<html><body>');

          res.write('<canvas id="myChart" width="400" height="200"></canvas>');

          res.write('<button id="loadMore">Load 25 Older Records</button>');

          res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
          res.write('<script>');
          res.write('var ctx = document.getElementById("myChart").getContext("2d");');
          res.write('var labels = ' + JSON.stringify(slicedValues.map((line) => line.date)) + ';');
          res.write('var data = ' + JSON.stringify(slicedValues.map((line) => line.value)) + ';');
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

          res.write('document.getElementById("loadMore").addEventListener("click", function() {');
          if (startIndex > 0) {
            startIndex = Math.max(0, startIndex - 25);
            const moreData = values.slice(startIndex, endIndex).map((line) => line.value);
            const moreLabels = values.slice(startIndex, endIndex).map((line) => line.date);
            res.write('myChart.data.labels = [].concat(moreLabels, myChart.data.labels.slice(0, -25));');
            res.write('myChart.data.datasets[0].data = [].concat(moreData, myChart.data.datasets[0].data.slice(0, -25));');
            res.write('myChart.update();');
          }
          res.write('});');

          res.write('</script>');

          res.write('</body></html>');
          res.end();
        }

        sendValues(startIndex, endIndex);
      });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
