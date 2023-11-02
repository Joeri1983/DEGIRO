const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv?sp=rw&st=2023-11-01T12:27:32Z&se=2023-11-01T20:27:32Z&spr=https&sv=2022-11-02&sr=c&sig=ndoa3k5uFv0yLUFOR17nkKFhj2zpJaKe3gzixg7z9yw%3D';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    // Serve a basic HTML form
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
  } else if (req.method === 'POST') {
    // Handle form submission
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', async () => {
      // Parse the form data
      const parsedData = new URLSearchParams(data.toString());
      const numericValue = parseFloat(parsedData.get('numericValue'));
      
      // Construct the data to append
      const valueToAppend = numericValue.toString();

      // Perform an HTTP PUT request to append data (not recommended)
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(valueToAppend).toString(),
        },
      };

      const req = https.request(azureStorageUrl, options, (response) => {
        if (response.statusCode === 201) {
          // Append operation successful
          // Get the current date
          const currentDate = new Date().toLocaleString();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.write('<html><body>');
          res.write(`<p>Entered numeric value: ${numericValue}</p>`);
          res.write(`<p>Current Date: ${currentDate}</p>`);
          res.write('<p>Contents of waardes.csv:</p>');
          // Fetch and display the updated contents of waardes.csv
          https.get(azureStorageUrl, (response) => {
            let updatedData = '';
            response.on('data', (chunk) => {
              updatedData += chunk;
            });

            response.on('end', () => {
              res.write(`<pre>${updatedData}</pre>`);
              res.write('</body></html>');
              res.end();
            });
          });
        } else {
          // Append operation failed
          res.statusCode = response.statusCode;
          res.end('Error appending to the CSV file in Azure Blob Storage.');
        }
      });

      req.write(valueToAppend);
      req.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
