const http = require('http');
const https = require('https');
const { BlobServiceClient } = require('@azure/storage-blob');
const port = process.env.PORT || 3000;

// Define your Azure Blob Storage connection string and container name
const connectionString = 'your-connection-string';
const containerName = 'your-container-name';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function appendValueToBlobStorage(value) {
  const blobName = 'waardes.csv';

  const blobClient = containerClient.getAppendBlobClient(blobName);
  
  try {
    const response = await blobClient.appendBlock(value);
    return response;
  } catch (error) {
    console.error('Error appending to Azure Blob Storage:', error);
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    // Serve a basic HTML form
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body>');
    res.write('<form method="POST">');
    res.write('<label for="numericValue">Enter a numeric value:</label>');
    res.write('<input type="number" id="numericValue" name="numericValue"><br>');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    res.write('<p>Contents of waardes.csv:</p>');
    
    // Fetch and display the contents of waardes.csv (if needed)
    // ...

    res.write('</body></html>');
    res.end();
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

      // Append the submitted value to Azure Blob Storage
      try {
        await appendValueToBlobStorage(numericValue.toString() + '\n');

        // Get the current date
        const currentDate = new Date().toLocaleString();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');
        res.write(`<p>Entered numeric value: ${numericValue}</p>`);
        res.write(`<p>Current Date: ${currentDate}</p>`);
        res.write('<p>Contents of waardes.csv:</p>');
        // Fetch and display the updated contents of waardes.csv (if needed)
        // ...
        res.write('</body></html>');
        res.end();
      } catch (error) {
        res.statusCode = 500;
        res.end('Error appending to the CSV file in Azure Blob Storage.');
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
