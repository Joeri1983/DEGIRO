const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
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
    res.write('</body></html>');
    res.end();
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
      res.write('</body></html>');
      res.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
