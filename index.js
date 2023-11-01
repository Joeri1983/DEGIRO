const http = require('http');
const axios = require('axios'); // Import the axios library
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
      const response = await axios.get('https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv?sp=r&st=2023-11-01T12:27:32Z&se=2023-11-01T20:27:32Z&spr=https&sv=2022-11-02&sr=c&sig=ndoa3k5uFv0yLUFOR17nkKFhj2zpJaKe3gzixg7z9yw%3D');
      const csvContent = response.data;
      res.write(`<pre>${csvContent}</pre>`);
    } catch (error) {
      res.write('Error fetching the CSV file.');
    }
    
    res.write('</body></html>');
    res.end();
  } else if (req.method === 'POST') {
    // Handle form submission
    // (The form submission code remains the same as in the previous answer)
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
