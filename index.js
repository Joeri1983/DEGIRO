const http = require('http');
const axios = require('axios');
const querystring = require('querystring');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve a basic HTML page with an input form
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body>');
    res.write('<form method="POST">');
    res.write('<p>Enter a numeric value:</p>');
    res.write('<input type="number" name="numericValue"><br>');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    res.write('</body></html>');
    res.end();
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const postData = querystring.parse(body);
      const numericValue = postData.numericValue;

      if (isNaN(numericValue)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Invalid input. Please enter a numeric value.');
        return;
      }

      // Append the new value to waardes.csv
      const newValue = new Date().toISOString().slice(0, 10).replace(/-/g, '') + ';' + numericValue + '\n';

      axios
        .put(azureStorageUrl, newValue, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'x-ms-blob-content-type': 'text/csv',
          },
        })
        .then((response) => {
          if (response.status === 201) {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            res.end();
          } else {
            res.statusCode = response.status;
            res.end('Error appending to the CSV file in Azure Blob Storage.');
          }
        })
        .catch((error) => {
          res.statusCode = 500;
          res.end('Failed to append data. ' + error.message);
        });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
