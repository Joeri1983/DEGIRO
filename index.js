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
    res.write('<p>Contents of waardes.csv:</p>');
    
    // Fetch and display the contents of waardes.csv
    https.get(azureStorageUrl, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.write(`<pre>${data}</pre>`);
        res.write('</body></html>');
        res.end();
      });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
