const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Value Display</title>
    </head>
    <body>
      <form action="/display" method="post">
        <label for="value">Enter a value:</label>
        <input type="text" name="value" id="value" />
        <button type="submit">Display</button>
      </form>
    </body>
    </html>
  `;
  res.send(html);
});

app.post('/display', (req, res) => {
  const value = req.body.value;
  res.send(`You entered: ${value}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
