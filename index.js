const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve a basic HTML page
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body>');
    res.write('<p>Latest 3 values from waardes.csv sorted by date:</p>');

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
            const columns = line.split(';'); // Change the separator to semicolon
            return {
              date: columns[0],
              value: columns[1],
            };
          })
          .sort((a, b) => b.date.localeCompare(a.date)) // Sort in descending order
          .slice(0, 3); // Take the latest 3 values

        res.write('<ul>');
        sortedLines.forEach((line) => {
          res.write(`<li>Date: ${line.date}, Value: ${line.value}</li>`);
        });
        res.write('</ul>');
        res.write('</body></html>');
        res.end();
      });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
