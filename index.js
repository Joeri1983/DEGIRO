const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const azureSasUrl = 'https://storagejoeri.blob.core.windows.net/dgjoeri/waardes.csv?comp=appendblock&sp=racwdyti&st=2023-11-02T15:21:13Z&se=2024-07-31T22:21:13Z&spr=https&sv=2022-11-02&sr=b&sig=oChszCUdn7GFjNWwECHIzHxuNdoJ9QJyDuGyYf1VNMk%3D';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body>');

    // Input bar for user to enter a value
    res.write('<div><label for="valueInput">Enter a Value:</label>');
    res.write('<input type="text" id="valueInput" name="value" />');
    res.write('<button onclick="submitValue()">Submit</button></div>');

    res.write('<p>Values:</p>');

    // Create a canvas for the chart
    res.write('<canvas id="myChart" width="400" height="200"></canvas>');

    // Generate the chart using Chart.js
    res.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
    res.write('<script>');
    res.write('var ctx = document.getElementById("myChart").getContext("2d");');
    // (You can keep your chart code here)

    res.write('function submitValue() {');
    res.write('var valueInput = document.getElementById("valueInput");');
    res.write('var value = valueInput.value;');
    res.write('var xhr = new XMLHttpRequest();');
    res.write('xhr.open("POST", "' + azureSasUrl + '", true);');
    res.write('xhr.setRequestHeader("Content-Type", "text/plain");');
    res.write('xhr.onreadystatechange = function() {');
    res.write('if (xhr.readyState === 4) {');
    res.write('if (xhr.status === 202) {');
    res.write('console.log("Value appended to the CSV file: " + value);');
    res.write('} else {');
    res.write('console.error("Error appending value to CSV file: " + xhr.statusText);');
    res.write('}');
    res.write('}');
    res.write('};');
    res.write('xhr.send(value);');
    res.write('}');
    res.write('</script>');

    res.write('</body></html>');
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
