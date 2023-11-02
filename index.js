const http = require('http');
const https = require('https');
const fs = require('fs');
const { URL } = require('url');
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
        res.write('<p>Values:</p>');

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

        // Add the data input form
        res.write(`
          <form method="POST" action="/addData">
            <label for="date">Date: </label>
            <input type="text" name="date" id="date" required><br><br>
            <label for="value">Value: </label>
            <input type="text" name="value" id="value" required><br><br>
            <input type="submit" value="Add Data">
          </form>
        `);

        res.write('</body></html>');
        res.end();
      });
    });
  } else if (req.method === 'POST') {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname === '/addData') {
      let requestBody = '';
      req.on('data', (data) => {
        requestBody += data;
      });

      req.on('end', () => {
        const formData = new URLSearchParams(requestBody);

        // Extract date and value from the form data
        const date = formData.get('date');
        const value = formData.get('value');

        // Append the data to the blob
        const appendUrl = 'https://myappendblobstore.blob.core.windows.net/myappendblobcontaiter/appendblob01?comp=appendblock';

        const appendData = `${date};${value}\n`;

        const options = {
          method: 'PUT',
          headers: {
            'x-ms-blob-type': 'AppendBlob',
            'Content-Length': appendData.length,
          },
        };

        const appendReq = https.request(appendUrl, options, (appendRes) => {
          if (appendRes.statusCode === 201) {
            // Data appended successfully
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.write('<html><body>');
            res.write('<p>Data has been added successfully.</p>');

            // Redisplay the form
            res.write(`
              <form method="POST" action="/addData">
                <label for="date">Date: </label>
                <input type="text" name="date" id="date" required><br><br>
                <label for="value">Value: </label>
                <input type="text" name="value" id="value" required><br><br>
                <input type="submit" value="Add Data">
              </form>
            `);

            res.write('</body></html>');
            res.end();
          } else {
            // Handle errors
            res.statusCode = 500;
            res.end('Error appending data to the blob.');
          }
        });

        appendReq.write(appendData);
        appendReq.end();
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
