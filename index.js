const express = require('express');
const fs = require('fs');
const path = require('path');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check route (important for Render)
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api', (req, res) => {
  const number = parseInt(req.query.number);

  // Validate number
  if (isNaN(number)) {
    return res.status(400).json({
      error: 'Please provide a valid number'
    });
  }

  const filePath = path.join(__dirname, 'all_sheets.json');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({
      error: 'JSON file not found on server'
    });
  }

  const fileStream = fs.createReadStream(filePath);
  const jsonStream = fileStream
    .pipe(parser())
    .pipe(streamArray());

  let found = false;

  jsonStream.on('data', ({ value }) => {
    if (value.number === number && !found) {
      found = true;
      res.json(value);
      fileStream.destroy(); // stop reading further
    }
  });

  jsonStream.on('end', () => {
    if (!found && !res.headersSent) {
      res.status(404).json({
        error: 'Number not found'
      });
    }
  });

  jsonStream.on('error', (err) => {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Error reading JSON file'
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
