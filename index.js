const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

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
    
    // Fetch and display the contents of waardes.csv
    try {
      const azureStorageUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv?sp=r&st=2023-11-01T12:27:32Z&se=2023-11-01T20:27:32Z&spr=https&sv=2022-11-02&sr=c&sig=ndoa3k5uFv0yLUFOR17nkKFhj2zpJaKe3gzixg7z9yw%3D';

      https.get(azureStorageUrl, (azureRes) => {
        let csvContent = '';

        azureRes.on('data', (chunk) => {
          csvContent += chunk;
        });

        azureRes.on('end', () => {
          res.write(`<pre>${csvContent}</pre>`);
          res.write('</body></html>');
          res.end();
        });
      });
    } catch (error) {
      res.write('Error fetching the CSV file.');
      res.write('</body></html>');
      res.end();
    }
  } else if (req.method === 'POST') {
    // Handle form submission
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      // Parse the form data
      const parsedData = new URLSearchParams(data.toString());
      const numericValue = parseFloat(parsedData.get('numericValue'));

      // Get the current date
      const currentDate = new Date().toLocaleString();

      // Display the entered value and the current date
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write('<html><body>');
      res.write(`<p>Entered numeric value: ${numericValue}</p>`);
      res.write(`<p>Current Date: ${currentDate}</p>`);
      res.write('<p>Contents of waardes.csv:</p>');
      res.write('<pre>Your CSV content here</pre>'); // You can replace 'Your CSV content here' with the actual CSV data.
      res.write('</body></html>');
      res.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
